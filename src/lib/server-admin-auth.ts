import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { put, list, del } from "@vercel/blob";

export interface AdminCredentials {
  username: string;
  password: string;
  updatedAt?: string;
}

const PREFIX = "carte-clinique/admin-auth";
const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: "admin",
  password: process.env.ADMIN_PASSWORD || "admin",
};

async function readLocalAuth(): Promise<AdminCredentials> {
  try {
    const file = path.join(process.cwd(), "uploads", "admin-auth.json");
    const buf = await readFile(file, "utf8");
    const parsed = JSON.parse(buf);
    if (parsed && typeof parsed.password === "string") {
      return {
        username: parsed.username || "admin",
        password: parsed.password,
        updatedAt: parsed.updatedAt,
      };
    }
    return DEFAULT_CREDENTIALS;
  } catch {
    return DEFAULT_CREDENTIALS;
  }
}

async function writeLocalAuth(creds: AdminCredentials) {
  try {
    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, "admin-auth.json"),
      JSON.stringify(creds, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Failed to write local admin auth file:", err);
  }
}

async function readBlobAuth(): Promise<AdminCredentials> {
  try {
    const { blobs } = await list({
      prefix: PREFIX,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!blobs.length) return await readLocalAuth();
    const latest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return await readLocalAuth();
    const parsed = await res.json();
    return parsed?.password ? parsed : await readLocalAuth();
  } catch {
    return await readLocalAuth();
  }
}

async function writeBlobAuth(creds: AdminCredentials) {
  try {
    await put(`${PREFIX}.json`, JSON.stringify(creds), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: true,
      cacheControlMaxAge: 60,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const { blobs } = await list({
      prefix: PREFIX,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    for (const b of blobs) {
      if (b.url) {
        await del(b.url, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => {});
      }
    }
  } catch (err) {
    console.error("Failed to write blob admin auth:", err);
  }
}

export async function getAdminCredentials(): Promise<AdminCredentials> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return await readBlobAuth();
  }
  return await readLocalAuth();
}

export async function saveAdminCredentials(creds: AdminCredentials): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await writeBlobAuth(creds);
  }
  await writeLocalAuth(creds);
}
