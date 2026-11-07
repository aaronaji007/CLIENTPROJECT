import "server-only";

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies, headers } from "next/headers";
import { put, list, del } from "@vercel/blob";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
  verifySession,
  type SessionPayload,
} from "./session-token";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

/**
 * Stored credential record. Passwords are never stored in plain text —
 * only an scrypt hash with a per-record random salt.
 */
export interface StoredCredentials {
  username: string;
  passwordHash: string; // "scrypt$<saltHex>$<hashHex>"
  version: string; // rotated on every password change → invalidates old sessions
  updatedAt?: string;
}

const PREFIX = "carte-clinique/admin-auth";
const LOCAL_FILE = path.join(process.cwd(), "uploads", "admin-auth.json");

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function safeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

// ---------------------------------------------------------------------------
// Storage (local file in dev, Vercel Blob in production)
// ---------------------------------------------------------------------------

/** Raw record may be a legacy plaintext record written by the previous version. */
type RawRecord = Partial<StoredCredentials> & { password?: string };

function normalise(raw: RawRecord | null): RawRecord | null {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.passwordHash !== "string" && typeof raw.password !== "string") return null;
  return raw;
}

async function readLocal(): Promise<RawRecord | null> {
  try {
    return normalise(JSON.parse(await readFile(LOCAL_FILE, "utf8")));
  } catch {
    return null;
  }
}

async function writeLocal(creds: StoredCredentials) {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(creds, null, 2), { encoding: "utf8", mode: 0o600 });
}

async function readBlob(): Promise<RawRecord | null> {
  const { blobs } = await list({ prefix: PREFIX, token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!blobs.length) return null;
  const latest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
  const res = await fetch(latest.url, { cache: "no-store" });
  if (!res.ok) return null;
  return normalise(await res.json());
}

async function writeBlob(creds: StoredCredentials) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const written = await put(`${PREFIX}.json`, JSON.stringify(creds), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true, // unguessable URL; listing requires the server-side token
    cacheControlMaxAge: 0,
    token,
  });
  // Remove older copies — but never the one we just wrote.
  const { blobs } = await list({ prefix: PREFIX, token });
  for (const b of blobs) {
    if (b.url !== written.url) await del(b.url, { token }).catch(() => {});
  }
}

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readRaw(): Promise<RawRecord | null> {
  try {
    return useBlob() ? await readBlob() : await readLocal();
  } catch (err) {
    console.error("[admin-auth] failed to read credentials", err);
    return null;
  }
}

async function saveCredentials(creds: StoredCredentials) {
  if (useBlob()) await writeBlob(creds);
  else await writeLocal(creds);
}

/** True when no custom password has ever been saved (still on bootstrap creds). */
export async function isUsingBootstrapPassword(): Promise<boolean> {
  const raw = await readRaw();
  return !raw;
}

/**
 * Bootstrap credentials used only until the first password change.
 * Set ADMIN_PASSWORD in the environment so the default is never "admin" in production.
 */
function bootstrapPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

export async function getAccountInfo() {
  const raw = await readRaw();
  if (!raw) {
    return {
      username: process.env.ADMIN_USERNAME || "admin",
      isDefault: true,
      updatedAt: null as string | null,
    };
  }
  return {
    username: raw.username || "admin",
    isDefault: false,
    updatedAt: raw.updatedAt ?? null,
  };
}

/** Verify username/password. Transparently upgrades legacy plaintext records to a hash. */
async function checkCredentials(username: string, password: string): Promise<StoredCredentials | null> {
  const raw = await readRaw();
  const uname = username.trim().toLowerCase();

  if (!raw) {
    const expectedUser = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
    const okUser = safeEqualStr(uname, expectedUser);
    const okPass = safeEqualStr(password, bootstrapPassword());
    if (okUser && okPass) {
      return { username: expectedUser, passwordHash: "", version: "bootstrap" };
    }
    return null;
  }

  const storedUser = (raw.username || "admin").trim().toLowerCase();
  if (!safeEqualStr(uname, storedUser)) {
    // Still run a hash to keep timing similar for unknown usernames.
    await hashPassword(password);
    return null;
  }

  if (typeof raw.passwordHash === "string") {
    if (!(await verifyPassword(password, raw.passwordHash))) return null;
    return {
      username: raw.username || "admin",
      passwordHash: raw.passwordHash,
      version: raw.version || "v1",
      updatedAt: raw.updatedAt,
    };
  }

  // Legacy plaintext record → verify then migrate to a hash.
  if (typeof raw.password === "string" && safeEqualStr(password, raw.password)) {
    const upgraded: StoredCredentials = {
      username: raw.username || "admin",
      passwordHash: await hashPassword(password),
      version: randomBytes(8).toString("hex"),
      updatedAt: new Date().toISOString(),
    };
    await saveCredentials(upgraded);
    return upgraded;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Brute-force protection (best-effort, per server instance)
// ---------------------------------------------------------------------------

const attempts = new Map<string, { count: number; first: number; lockedUntil: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isLocked(key: string): number {
  const rec = attempts.get(key);
  if (!rec) return 0;
  const now = Date.now();
  if (rec.lockedUntil > now) return rec.lockedUntil - now;
  if (now - rec.first > WINDOW_MS) attempts.delete(key);
  return 0;
}

function recordFailure(key: string) {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now, lockedUntil: 0 });
    return;
  }
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) rec.lockedUntil = now + LOCK_MS;
}

/** Generic fixed-window rate limiter for public endpoints (per instance). */
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    }
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

async function setSessionCookie(payload: Omit<SessionPayload, "exp">) {
  const token = await signSession({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function login(
  username: string,
  password: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (typeof username !== "string" || typeof password !== "string") {
    return { success: false, error: "Invalid username or password." };
  }
  if (username.length > 100 || password.length > 256) {
    return { success: false, error: "Invalid username or password." };
  }

  const key = `login:${await clientIp()}`;
  const lockedFor = isLocked(key);
  if (lockedFor > 0) {
    return {
      success: false,
      error: `Too many failed attempts. Try again in ${Math.ceil(lockedFor / 60000)} minutes.`,
    };
  }

  const creds = await checkCredentials(username, password);
  if (!creds) {
    recordFailure(key);
    return { success: false, error: "Invalid username or password." };
  }

  attempts.delete(key);
  await setSessionCookie({ sub: creds.username, v: creds.version });
  return { success: true };
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Returns the active session or null. Also checks the credential version. */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const raw = await readRaw();
  const currentVersion = raw ? raw.version || "v1" : "bootstrap";
  // Legacy plaintext records have no version; accept until they are migrated.
  if (raw && !raw.passwordHash) return session;
  if (!safeEqualStr(session.v, currentVersion)) return null;
  return session;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

/**
 * Throw unless the caller has a valid admin session. Use at the top of every admin action.
 * Sessions created with the bootstrap/default password can ONLY change the password —
 * every other admin capability is blocked until a real password is set.
 */
export async function requireAdmin(opts: { allowBootstrap?: boolean } = {}): Promise<SessionPayload> {
  const s = await getSession();
  if (!s) throw new UnauthorizedError();
  if (s.v === "bootstrap" && !opts.allowBootstrap) throw new UnauthorizedError();
  return s;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  newUsername?: string,
): Promise<{ success: true; username: string } | { success: false; error: string }> {
  const session = await requireAdmin({ allowBootstrap: true });

  if (typeof newPassword !== "string" || newPassword.length < 10) {
    return { success: false, error: "New password must be at least 10 characters long." };
  }
  if (newPassword.length > 256) {
    return { success: false, error: "New password is too long." };
  }
  if (newPassword.toLowerCase() === "admin" || newPassword.toLowerCase() === "password1234") {
    return { success: false, error: "That password is too common. Pick something unique." };
  }

  const key = `chpw:${await clientIp()}`;
  if (isLocked(key) > 0) {
    return { success: false, error: "Too many failed attempts. Try again later." };
  }

  const verified = await checkCredentials(session.sub, currentPassword);
  if (!verified) {
    recordFailure(key);
    return { success: false, error: "The current password you entered is incorrect." };
  }

  const username = (newUsername ?? verified.username).trim();
  if (!/^[a-zA-Z0-9._@-]{3,64}$/.test(username)) {
    return {
      success: false,
      error: "Username must be 3–64 characters: letters, numbers, dot, dash, underscore or @.",
    };
  }

  const updated: StoredCredentials = {
    username,
    passwordHash: await hashPassword(newPassword),
    version: randomBytes(8).toString("hex"),
    updatedAt: new Date().toISOString(),
  };
  await saveCredentials(updated);
  // Re-issue this admin's session with the new version; all other sessions are now invalid.
  await setSessionCookie({ sub: updated.username, v: updated.version });
  return { success: true, username };
}
