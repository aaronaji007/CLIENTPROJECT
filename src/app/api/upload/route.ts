import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/server-admin-auth";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// Content-Type is derived from the verified extension — never from the client.
const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

/** Check the file's magic bytes so an HTML/SVG/script file can't be smuggled in as ".png". */
function sniff(buf: Uint8Array): string | null {
  const at = (i: number, bytes: number[]) => bytes.every((b, j) => buf[i + j] === b);
  if (at(0, [0xff, 0xd8, 0xff])) return "jpg";
  if (at(0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (at(0, [0x47, 0x49, 0x46, 0x38])) return "gif";
  if (at(0, [0x52, 0x49, 0x46, 0x46]) && at(8, [0x57, 0x45, 0x42, 0x50])) return "webp";
  if (at(4, [0x66, 0x74, 0x79, 0x70]) && (at(8, [0x61, 0x76, 0x69, 0x66]) || at(8, [0x61, 0x76, 0x69, 0x73]))) return "avif";
  return null;
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  if (Number(req.headers.get("content-length") || 0) > MAX_BYTES + 64 * 1024) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 413 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const detected = sniff(bytes);
    if (!detected) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }
    const ext = detected === "jpeg" ? "jpg" : detected;
    const contentType = TYPES[ext];
    const safe = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`carte-clinique/${safe}`, Buffer.from(bytes), {
        access: "public",
        contentType,
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    }

    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, safe), Buffer.from(bytes));
    return NextResponse.json({ url: `/api/media/${safe}` });
  } catch (err) {
    console.error("[upload] failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
