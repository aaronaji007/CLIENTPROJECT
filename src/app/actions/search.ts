"use server";
import { db } from "@/prisma/db";
import { specialties as fallbackSpecialties, packages as fallbackPackages } from "@/lib/data";

export async function searchDb(query: string) {
  if (typeof query !== "string" || query.length < 2) return [];
  // Cap input size — this endpoint is public and loads tables into memory.
  if (query.length > 80) query = query.slice(0, 80);

  const lowerQuery = query.toLowerCase();
  
  let specialties: any[] = [];
  let packages: any[] = [];
  try {
    specialties = await db.orm.public.Specialty.all();
    packages = await db.orm.public.Package.all();
  } catch {
    specialties = fallbackSpecialties;
    packages = fallbackPackages;
  }

  const results = [];

  for (const s of specialties) {
    if (s.name.toLowerCase().includes(lowerQuery) || s.category.toLowerCase().includes(lowerQuery)) {
      results.push({ type: 'Specialty', title: s.name, slug: s.slug, href: `/specialties/${s.slug}` });
    }
  }

  for (const p of packages) {
    if (p.name.toLowerCase().includes(lowerQuery) || p.country.toLowerCase().includes(lowerQuery)) {
      results.push({ type: 'Package', title: p.name, slug: p.slug, href: `/packages/${p.slug}` });
    }
  }

  return results.slice(0, 10);
}
