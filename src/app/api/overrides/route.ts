import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/server-admin-auth";

export const runtime = "nodejs";

const PREFIX = "carte-clinique/overrides";
const MAX_BYTES = 1_000_000; // 1 MB of site copy is plenty
const EMPTY = { specialties: {}, packages: {}, posts: {} };

async function readLocal(): Promise<object> {
  try {
    const buf = await readFile(path.join(process.cwd(), "uploads", "overrides.json"), "utf8");
    return JSON.parse(buf);
  } catch {
    return EMPTY;
  }
}

async function writeLocal(obj: object) {
  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "overrides.json"), JSON.stringify(obj), "utf8");
}

async function readBlob(): Promise<object> {
  const { blobs } = await list({ prefix: PREFIX, token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!blobs.length) return EMPTY;
  const latest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
  const res = await fetch(latest.url, { cache: "no-store" });
  return res.ok ? await res.json() : EMPTY;
}

async function writeBlob(obj: object) {
  const blob = await put(`${PREFIX}.json`, JSON.stringify(obj), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 60,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  const { blobs } = await list({ prefix: PREFIX, token: process.env.BLOB_READ_WRITE_TOKEN });
  for (const b of blobs) {
    if (b.url !== blob.url) await del(b.url, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => {});
  }
}

export async function GET() {
  try {
    const data = process.env.BLOB_READ_WRITE_TOKEN ? await readBlob() : await readLocal();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(EMPTY, { headers: { "Cache-Control": "no-store" } });
  }
}

export async function PUT(req: Request) {
  // Real server-side session check (the old "x-cc-admin: 1" header was trivially spoofable).
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Basic CSRF defence in addition to the SameSite=Strict cookie.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }
  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) await writeBlob(body as object);
    else await writeLocal(body as object);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[overrides] save failed", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
