"use server";

import { db } from "@/prisma/db";
import type { FieldInputTypes, FieldOutputTypes } from "@/prisma/contract.d";
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

export type SpecialtyRow = Omit<FieldOutputTypes["public"]["Specialty"], "procedures"> & {
  procedures: string[];
};

export type PackageRow = Omit<FieldOutputTypes["public"]["Package"], "includes"> & {
  includes: string[];
  specialty: string;
};

export type InquiryRow = Omit<FieldOutputTypes["public"]["Inquiry"], "files"> & {
  files: string[];
};

export type SubscriberRow = FieldOutputTypes["public"]["Subscriber"];

type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type SpecialtyCreate = Omit<FieldInputTypes["public"]["Specialty"], "id">;
type SpecialtyUpdate = Partial<Mutable<Omit<SpecialtyCreate, "slug">>>;
type PackageCreate = Omit<FieldInputTypes["public"]["Package"], "id">;
type PackageUpdate = Partial<Mutable<Omit<PackageCreate, "slug">>>;

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

function cleanProcedure(raw: string): string {
  return raw.split(/\s*·\s*|\s*—\s*/)[0].trim();
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

function buildSpecialtyCreate(slug: string, d: Record<string, unknown>): SpecialtyCreate {
  return {
    slug,
    category: str(d.category, 120, "General Surgery") || "General Surgery",
    name: str(d.name, 160),
    tagline: str(d.tagline, 300),
    summary: str(d.summary, 1000),
    overview: str(d.overview, 5000),
    procedures: strArr(d.procedures, 100, 300).map(cleanProcedure).filter(Boolean),
    recovery: str(d.recovery, 5000),
    outcomes: str(d.outcomes, 2000),
    travelDays: "",
    photo: safePhoto(d.photo, "/images/orthopedics.webp"),
  };
}

function buildSpecialtyUpdate(d: Record<string, unknown>): SpecialtyUpdate {
  const out: SpecialtyUpdate = {};
  if ("category" in d) out.category = str(d.category, 120, "General Surgery") || "General Surgery";
  if ("name" in d) out.name = str(d.name, 160);
  if ("tagline" in d) out.tagline = str(d.tagline, 300);
  if ("summary" in d) out.summary = str(d.summary, 1000);
  if ("overview" in d) out.overview = str(d.overview, 5000);
  if ("procedures" in d) out.procedures = strArr(d.procedures, 100, 300).map(cleanProcedure).filter(Boolean);
  if ("recovery" in d) out.recovery = str(d.recovery, 5000);
  if ("outcomes" in d) out.outcomes = str(d.outcomes, 2000);
  if ("photo" in d) out.photo = safePhoto(d.photo, "/images/orthopedics.webp");
  return out;
}

function buildPackageCreate(slug: string, d: Record<string, unknown>): PackageCreate {
  return {
    slug,
    name: str(d.name, 160),
    country: "",
    city: "",
    price: str(d.price, 40),
    currency: str(d.currency, 8, "USD").toUpperCase() || "USD",
    days: 0,
    specialtyId: str(d.specialtyId, 64),
    summary: str(d.summary, 1000),
    includes: strArr(d.includes, 50, 300),
    notes: str(d.notes, 2000),
    photo: safePhoto(d.photo, "/images/orthopedics.webp"),
  };
}

function buildPackageUpdate(d: Record<string, unknown>): PackageUpdate {
  const out: PackageUpdate = {};
  if ("name" in d) out.name = str(d.name, 160);
  if ("price" in d) out.price = str(d.price, 40);
  if ("currency" in d) out.currency = str(d.currency, 8, "USD").toUpperCase() || "USD";
  if ("specialtyId" in d) out.specialtyId = str(d.specialtyId, 64);
  if ("summary" in d) out.summary = str(d.summary, 1000);
  if ("includes" in d) out.includes = strArr(d.includes, 50, 300);
  if ("notes" in d) out.notes = str(d.notes, 2000);
  if ("photo" in d) out.photo = safePhoto(d.photo, "/images/orthopedics.webp");
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

export async function fetchAdminData(): Promise<{
  specialties: SpecialtyRow[];
  packages: PackageRow[];
  inquiries: InquiryRow[];
  subscribers: SubscriberRow[];
}> {
  await requireAdmin();
  try {
    const rawSpecialties = await db.orm.public.Specialty.all();
    const specialties: SpecialtyRow[] = rawSpecialties.map((s) => ({
      ...s,
      procedures: [...s.procedures],
    }));

    const rawPackages = await db.orm.public.Package.include("specialty").all();
    const packages: PackageRow[] = rawPackages.map((p) => {
      const { specialty: specRel, ...rest } = p;
      const specName =
        specRel && typeof specRel === "object" && "name" in specRel
          ? String((specRel as { name: string }).name)
          : "";
      return {
        ...rest,
        includes: [...rest.includes],
        specialty: specName,
      };
    });

    const rawInquiries = await db.orm.public.Inquiry.all();
    const inquiries: InquiryRow[] = rawInquiries
      .map((i) => ({ ...i, files: [...i.files] }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const rawSubscribers = await db.orm.public.Subscriber.all();
    const subscribers = [...rawSubscribers].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
  photo?: string;
}) {
  await requireAdmin();
  const d = asObj(data);
  const slug = slugify(d.slug || d.name);
  if (!slug) throw new Error("A valid slug or name is required");
  const fields = buildSpecialtyCreate(slug, d);
  if (!fields.name) throw new Error("Name is required");

  const result = await db.orm.public.Specialty.create(fields);

  revalidatePath("/");
  revalidatePath("/specialties");
  revalidatePath("/faq");
  revalidatePath(`/specialties/${result.slug}`);
  return { ...result, procedures: [...result.procedures] };
}

export async function updateSpecialtyDb(slug: string, patch: Record<string, unknown>) {
  await requireAdmin();
  const s = slugify(slug);
  const fields = buildSpecialtyUpdate(asObj(patch));
  const result = await db.orm.public.Specialty.where({ slug: s }).update(fields);
  revalidatePath("/");
  revalidatePath("/specialties");
  revalidatePath("/faq");
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
  revalidatePath("/faq");
  return { ok: true };
}

export async function createPackageDb(data: {
  slug: string;
  name: string;
  price: string;
  currency: string;
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
  const fields = buildPackageCreate(slug, d);
  if (!fields.name || !fields.specialtyId) throw new Error("Name and specialty are required");

  const result = await db.orm.public.Package.create(fields);

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath(`/packages/${result.slug}`);
  return { ...result, includes: [...result.includes] };
}

export async function updatePackageDb(slug: string, patch: Record<string, unknown>) {
  await requireAdmin();
  const s = slugify(slug);
  const fields = buildPackageUpdate(asObj(patch));
  const result = await db.orm.public.Package.where({ slug: s }).update(fields);
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

export async function createInquiryDb(data: unknown) {
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
  });
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
