"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function fetchAdminData() {
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
  const result = await db.orm.public.Specialty.create({
    slug: data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
    category: data.category || "General Surgery",
    name: data.name,
    tagline: data.tagline || "",
    summary: data.summary || "",
    overview: data.overview || "",
    procedures: data.procedures || [],
    recovery: data.recovery || "",
    outcomes: data.outcomes || "",
    travelDays: data.travelDays || "Stay 3-5 days",
    photo: data.photo || "/images/orthopedics.webp",
  });

  revalidatePath("/");
  revalidatePath("/specialties");
  revalidatePath(`/specialties/${result.slug}`);
  return result;
}

export async function updateSpecialtyDb(slug: string, patch: any) {
  const result = await db.orm.public.Specialty.where({ slug }).update(patch);
  revalidatePath("/");
  revalidatePath("/specialties");
  revalidatePath(`/specialties/${slug}`);
  return result;
}

export async function deleteSpecialtyDb(slug: string) {
  const existing = await db.orm.public.Specialty.where({ slug }).first();
  if (existing) {
    await db.orm.public.Package.where({ specialtyId: existing.id }).deleteAll();
    await db.orm.public.Specialty.where({ slug }).delete();
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
  const result = await db.orm.public.Package.create({
    slug: data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
    name: data.name,
    country: data.country || "India",
    city: data.city || "New Delhi",
    price: data.price,
    currency: data.currency || "AUD",
    days: Number(data.days) || 5,
    specialtyId: data.specialtyId,
    summary: data.summary || "",
    includes: data.includes || [],
    notes: data.notes || "",
    photo: data.photo || "/images/orthopedics.webp",
  });

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath(`/packages/${result.slug}`);
  return result;
}

export async function updatePackageDb(slug: string, patch: any) {
  if (patch.days !== undefined) {
    patch.days = Number(patch.days);
  }
  const result = await db.orm.public.Package.where({ slug }).update(patch);
  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath(`/packages/${slug}`);
  return result;
}

export async function deletePackageDb(slug: string) {
  await db.orm.public.Package.where({ slug }).delete();
  revalidatePath("/");
  revalidatePath("/packages");
  return { ok: true };
}

export async function updateInquiryStatusDb(id: string, status: string) {
  return await db.orm.public.Inquiry.where({ id }).update({ status });
}

export async function deleteSubscriberDb(email: string) {
  return await db.orm.public.Subscriber.where({ email }).delete();
}

export async function createInquiryDb(data: any) {
  return await db.orm.public.Inquiry.create(data);
}

export async function createSubscriberDb(email: string) {
  try {
    return await db.orm.public.Subscriber.create({ email });
  } catch {
    return { ok: false };
  }
}
