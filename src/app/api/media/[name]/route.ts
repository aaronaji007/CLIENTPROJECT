import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!/^[a-z0-9._-]+$/i.test(name) || name.includes("..")) {
    return new NextResponse("Invalid name", { status: 400 });
  }
  const ext = (name.split(".").pop() || "").toLowerCase();
  const type = TYPES[ext];
  if (!type) return new NextResponse("Unsupported type", { status: 415 });

  try {
    const buf = await readFile(path.join(process.cwd(), "uploads", name));
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
