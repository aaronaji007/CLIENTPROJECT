import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-admin-auth";
import {
  DEFAULT_OVERRIDES,
  isSameOrigin,
  readOverrides,
  writeOverrides,
} from "@/lib/server-overrides";

export const runtime = "nodejs";

const MAX_BYTES = 1_000_000; // 1 MB of site copy is plenty

export async function GET() {
  try {
    const data = await readOverrides();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(DEFAULT_OVERRIDES, { headers: { "Cache-Control": "no-store" } });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSameOrigin(req)) {
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
    await writeOverrides(body as object);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[overrides] save failed", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
