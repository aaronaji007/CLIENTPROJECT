"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import {
  requireAdmin,
  login,
  logout,
  getSession,
  getAccountInfo,
  changePassword,
  clientIp,
  rateLimit,
} from "@/lib/server-admin-auth";

/*
 * SECURITY NOTE
 * Every exported function in a "use server" file is a publicly callable HTTP
 * endpoint — hiding the button in the UI does not protect it. Every admin
 * action therefore calls `requireAdmin()` first, and every input is validated
 * against an explicit allow-list of fields with length limits.
 */

// ---------------------------------------------------------------------------
// Input sanitisers (not exported → not endpoints)
// ---------------------------------------------------------------------------

function str(v: unknown, max: number, fallback = ""): string {
  if (typeof v !== "string") return fallback;
  return v.slice(0, max).trim();
}

function strArr(v: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .slice(0, maxItems)
    .map((x) => x.slice(0, maxLen).trim())
    .filter(Boolean);
}

function slugify(v: unknown): string {
  return str(v, 120)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Only allow site-relative image paths or images on our Vercel Blob store. */
function safePhoto(v: unknown, fallback: string): string {
  const s = str(v, 500);
  if (!s) return fallback;
  if (/^\/(images|api\/media)\/[a-zA-Z0-9._\-/]+$/.test(s) && !s.includes("..")) return s;
  try {
    const u = new URL(s);
    if (u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com")) return s;
  } catch {
    /* not a URL */
  }
  return fallback;
}

function specialtyFields(data: Record<string, unknown>, partial: boolean) {
  const out: Record<string, unknown> = {};
  const has = (k: string) => !partial || k in data;
  if (has("category")) out.category = str(data.category, 120, "General Surgery") || "General Surgery";
  if (has("name")) out.name = str(data.name, 160);
  if (has("tagline")) out.tagline = str(data.tagline, 300);
  if (has("summary")) out.summary = str(data.summary, 1000);
  if (has("overview")) out.overview = str(data.overview, 5000);
  if (has("procedures")) out.procedures = strArr(data.procedures, 100, 300);
  if (has("recovery")) out.recovery = str(data.recovery, 5000);
  if (has("outcomes")) out.outcomes = str(data.outcomes, 2000);
  if (has("travelDays")) out.travelDays = str(data.travelDays, 120, "Stay 3-5 days") || "Stay 3-5 days";
  if (has("photo")) out.photo = safePhoto(data.photo, "/images/orthopedics.webp");
  return out;
}

function packageFields(data: Record<string, unknown>, partial: boolean) {
  const out: Record<string, unknown> = {};
  const has = (k: string) => !partial || k in data;
  if (has("name")) out.name = str(data.name, 160);
  if (has("country")) out.country = str(data.country, 80, "India") || "India";
  if (has("city")) out.city = str(data.city, 80, "New Delhi") || "New Delhi";
  if (has("price")) out.price = str(data.price, 40);
  if (has("currency")) out.currency = str(data.currency, 8, "AUD").toUpperCase() || "AUD";
  if (has("days")) {
    const d = Math.round(Number(data.days));
    out.days = Number.isFinite(d) && d > 0 && d < 366 ? d : 5;
  }
  if (has("specialtyId")) out.specialtyId = str(data.specialtyId, 64);
  if (has("summary")) out.summary = str(data.summary, 1000);
  if (has("includes")) out.includes = strArr(data.includes, 50, 300);
  if (has("notes")) out.notes = str(data.notes, 2000);
  if (has("photo")) out.photo = safePhoto(data.photo, "/images/orthopedics.webp");
  return out;
}

const asObj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

// ---------------------------------------------------------------------------
// Auth actions
// ---------------------------------------------------------------------------

export async function verifyAdminLoginAction(username: string, password: string) {
  return await login(username, password);
}

export async function logoutAdminAction() {
  await logout();
  return { ok: true };
}

/** Lightweight session check for the admin UI. Exposes no secrets. */
export async function getAdminSessionAction() {
  const s = await getSession();
  if (!s) return { authed: false as const };
  return { authed: true as const, username: s.sub, mustChangePassword: s.v === "bootstrap" };
}

export async function getAdminAccountInfoAction() {
  await requireAdmin({ allowBootstrap: true });
  return await getAccountInfo();
}

export async function changeAdminPasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  newUsername?: string;
}) {
  try {
    const d = asObj(data);
    const res = await changePassword(
      str(d.currentPassword, 256),
      typeof d.newPassword === "string" ? d.newPassword : "",
      typeof d.newUsername === "string" ? d.newUsername : undefined,
    );
    if (res.success) revalidatePath("/admin");
    return res;
  } catch (err) {
    if (err instanceof Error && err.name === "UnauthorizedError") {
      return { success: false as const, error: "Your session has expired. Please sign in again." };
    }
    console.error("Error changing admin password:", err);
    return { success: false as const, error: "Failed to update password. Try again." };
  }
}

// ---------------------------------------------------------------------------
// Admin data actions (all require an authenticated admin)
// ---------------------------------------------------------------------------

export async function fetchAdminData() {
  await requireAdmin();
  try {
    const specialties = await db.orm.public.Specialty.all();
    const rawPackages = await db.orm.public.Package.include("specialty").all();
    const packages = rawPackages.map((p) => ({
      ...p,
      specialty: p.specialty ? (p.specialty as any).name : "",
    }));

    const rawInquiries = await db.orm.public.Inquiry.all();
    const inquiries = rawInquiries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const rawSubscribers = await db.orm.public.Subscriber.all();
    const subscribers = rawSubscribers.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { specialties, packages, inquiries, subscribers };
  } catch (err) {
    console.error("Error in fetchAdminData:", err);
    return { specialties: [], packages: [], inquiries: [], subscribers: [] };
  }
}

export async function createSpecialtyDb(data: {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  summary: string;
  overview: string;
  procedures: string[];
  recovery: string;
  outcomes: string;
  travelDays: string;
  photo?: string;
}) {
  await requireAdmin();
  const d = asObj(data);
  const slug = slugify(d.slug || d.name);
  if (!slug) throw new Error("A valid slug or name is required");
  const fields = specialtyFields(d, false);
  if (!fields.name) throw new Error("Name is required");

  const result = await db.orm.public.Specialty.create({ slug, ...fields } as any);

  revalidatePath("/");
  revalidatePath("/specialties");
  revalidatePath(`/specialties/${result.slug}`);
  return result;
}

export async function updateSpecialtyDb(slug: string, patch: any) {
  await requireAdmin();
  const s = slugify(slug);
  const fields = specialtyFields(asObj(patch), true);
  const result = await db.orm.public.Specialty.where({ slug: s }).update(fields as any);
  revalidatePath("/");
  revalidatePath("/specialties");
  revalidatePath(`/specialties/${s}`);
  return result;
}

export async function deleteSpecialtyDb(slug: string) {
  await requireAdmin();
  const s = slugify(slug);
  const existing = await db.orm.public.Specialty.where({ slug: s }).first();
  if (existing) {
    await db.orm.public.Package.where({ specialtyId: existing.id }).deleteAll();
    await db.orm.public.Specialty.where({ slug: s }).delete();
  }
  revalidatePath("/");
  revalidatePath("/specialties");
  revalidatePath("/packages");
  return { ok: true };
}

export async function createPackageDb(data: {
  slug: string;
  name: string;
  country: string;
  city: string;
  price: string;
  currency: string;
  days: number;
  specialtyId: string;
  summary: string;
  includes: string[];
  notes: string;
  photo?: string;
}) {
  await requireAdmin();
  const d = asObj(data);
  const slug = slugify(d.slug || d.name);
  if (!slug) throw new Error("A valid slug or name is required");
  const fields = packageFields(d, false);
  if (!fields.name || !fields.specialtyId) throw new Error("Name and specialty are required");

  const result = await db.orm.public.Package.create({ slug, ...fields } as any);

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath(`/packages/${result.slug}`);
  return result;
}

export async function updatePackageDb(slug: string, patch: any) {
  await requireAdmin();
  const s = slugify(slug);
  const fields = packageFields(asObj(patch), true);
  const result = await db.orm.public.Package.where({ slug: s }).update(fields as any);
  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath(`/packages/${s}`);
  return result;
}

export async function deletePackageDb(slug: string) {
  await requireAdmin();
  await db.orm.public.Package.where({ slug: slugify(slug) }).delete();
  revalidatePath("/");
  revalidatePath("/packages");
  return { ok: true };
}

export async function updateInquiryStatusDb(id: string, status: string) {
  await requireAdmin();
  const safeStatus = status === "read" ? "read" : "new";
  return await db.orm.public.Inquiry.where({ id: str(id, 64) }).update({ status: safeStatus });
}

export async function deleteSubscriberDb(email: string) {
  await requireAdmin();
  return await db.orm.public.Subscriber.where({ email: str(email, 254).toLowerCase() }).delete();
}

// ---------------------------------------------------------------------------
// Public actions (no auth, but validated + rate limited)
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

export async function createInquiryDb(data: any) {
  const ip = await clientIp();
  if (!rateLimit(`inquiry:${ip}`, 5, 60 * 60 * 1000)) {
    throw new Error("Too many inquiries from this network. Please try again later.");
  }
  const d = asObj(data);
  const email = str(d.email, 254).toLowerCase();
  const name = str(d.name, 120);
  const condition = str(d.condition, 300);
  if (!name || !condition || !EMAIL_RE.test(email)) {
    throw new Error("Please provide your name, a valid email and your condition.");
  }
  const timeline = ["urgent", "next-3-months", "flexible"].includes(str(d.timeline, 20))
    ? str(d.timeline, 20)
    : "flexible";

  // Only allow-listed fields — never trust client-supplied id/status/createdAt.
  await db.orm.public.Inquiry.create({
    condition,
    procedure: str(d.procedure, 200) || null,
    timeline,
    name,
    email,
    country: str(d.country, 80) || null,
    notes: str(d.notes, 4000) || null,
    files: strArr(d.files, 10, 200),
    status: "new",
  } as any);
  return { ok: true };
}

export async function createSubscriberDb(email: string) {
  const ip = await clientIp();
  if (!rateLimit(`subscribe:${ip}`, 5, 60 * 60 * 1000)) return { ok: false };
  const e = str(email, 254).toLowerCase();
  if (!EMAIL_RE.test(e)) return { ok: false };
  try {
    await db.orm.public.Subscriber.create({ email: e });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
