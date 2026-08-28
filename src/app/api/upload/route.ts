import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ALLOWED = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const rawExt = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!ALLOWED.has(rawExt)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${rawExt}`;
    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, safe), Buffer.from(bytes));
    return NextResponse.json({ url: `/api/media/${safe}` });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 },
    );
  }
}
