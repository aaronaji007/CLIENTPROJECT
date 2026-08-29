import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const PREFIX = "carte-clinique/overrides.json";
const ADMIN_HEADER = "x-cc-admin";
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
  const res = await fetch(blobs[0].url);
  return res.ok ? await res.json() : EMPTY;
}

async function writeBlob(obj: object) {
  await put(PREFIX, JSON.stringify(obj), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function GET() {
  try {
    const data = process.env.BLOB_READ_WRITE_TOKEN ? await readBlob() : await readLocal();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(EMPTY);
  }
}

export async function PUT(req: Request) {
  if (req.headers.get(ADMIN_HEADER) !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) await writeBlob(body as object);
    else await writeLocal(body as object);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
