"use server";
import { db } from "@/prisma/db";

export async function fetchAdminData() {
  const specialties = await db.orm.public.Specialty.all();
  const packages = await db.orm.public.Package.include("specialty").all();
  
  const rawInquiries = await db.orm.public.Inquiry.all();
  const inquiries = rawInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const rawSubscribers = await db.orm.public.Subscriber.all();
  const subscribers = rawSubscribers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return { specialties, packages, inquiries, subscribers };
}

export async function updateSpecialtyDb(slug: string, patch: any) {
  return await db.orm.public.Specialty.where({ slug }).update(patch);
}

export async function updatePackageDb(slug: string, patch: any) {
  return await db.orm.public.Package.where({ slug }).update(patch);
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
  } catch (e) {
    return { ok: false };
  }
}
