import "server-only";

import { put, list, del } from "@vercel/blob";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { ContentOverrides } from "./override-context";

const PREFIX = "carte-clinique/overrides";

export const DEFAULT_OVERRIDES: ContentOverrides = {
  specialties: {},
  packages: {},
  posts: {},
  landing: {},
  site: {},
};

/** Safe CSRF same-origin check; returns false if the Origin header is malformed or mismatched. */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function readLocal(): Promise<ContentOverrides> {
  try {
    const buf = await readFile(path.join(process.cwd(), "uploads", "overrides.json"), "utf8");
    return { ...DEFAULT_OVERRIDES, ...(JSON.parse(buf) as Partial<ContentOverrides>) };
  } catch {
    return DEFAULT_OVERRIDES;
  }
}

async function writeLocal(obj: object) {
  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "overrides.json"), JSON.stringify(obj), "utf8");
}

async function readBlob(): Promise<ContentOverrides> {
  const { blobs } = await list({ prefix: PREFIX, token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!blobs.length) return DEFAULT_OVERRIDES;
  const latest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
  const res = await fetch(latest.url, { cache: "no-store" });
  if (!res.ok) return DEFAULT_OVERRIDES;
  return { ...DEFAULT_OVERRIDES, ...((await res.json()) as Partial<ContentOverrides>) };
}

async function writeBlob(obj: object) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const blob = await put(`${PREFIX}.json`, JSON.stringify(obj), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 60,
    token,
  });
  const { blobs } = await list({ prefix: PREFIX, token });
  for (const b of blobs) {
    if (b.url !== blob.url) await del(b.url, { token }).catch(() => {});
  }
}

export async function readOverrides(): Promise<ContentOverrides> {
  try {
    return process.env.BLOB_READ_WRITE_TOKEN ? await readBlob() : await readLocal();
  } catch {
    return DEFAULT_OVERRIDES;
  }
}

export async function writeOverrides(obj: object): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) await writeBlob(obj);
  else await writeLocal(obj);
}
