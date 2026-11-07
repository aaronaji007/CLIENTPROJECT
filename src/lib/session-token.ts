/**
 * Stateless, HMAC-signed admin session tokens.
 *
 * Uses Web Crypto only, so it runs in both the Node runtime (server actions,
 * route handlers) and the proxy layer. The token is stored in an httpOnly,
 * Secure, SameSite=Strict cookie, so it is never readable by client JS.
 *
 * Token format:  base64url(JSON payload) + "." + base64url(HMAC-SHA256)
 */

export const SESSION_COOKIE = "cc_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export interface SessionPayload {
  sub: string; // admin username
  v: string; // credential version — changes on password change, invalidating old sessions
  exp: number; // unix seconds
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Signing secret. Prefer a dedicated ADMIN_SESSION_SECRET. If it is not set we
 * derive one from DATABASE_URL (already a server-only secret) so sessions keep
 * working across serverless instances instead of silently breaking.
 */
function getSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit && explicit.length >= 32) return explicit;
  const fallback = process.env.DATABASE_URL;
  if (fallback) return `derived-session-key::${fallback}`;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return "insecure-dev-only-session-secret-change-me";
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string" || token.length > 2048) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    // crypto.subtle.verify is constant-time.
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      fromB64url(sig) as BufferSource,
      enc.encode(body),
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (typeof payload.sub !== "string" || typeof payload.v !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}
