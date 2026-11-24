"use server";
import { db } from "@/prisma/db";
import { specialties as fallbackSpecialties, packages as fallbackPackages } from "@/lib/data";

export type SearchResult = {
  type: "Specialty" | "Package";
  title: string;
  slug: string;
  href: string;
};

type SearchableSpecialty = { slug: string; name: string; category: string };
type SearchablePackage = { slug: string; name: string; summary: string };

export async function searchDb(query: string): Promise<SearchResult[]> {
  if (typeof query !== "string" || query.length < 2) return [];
  // Cap input size — this endpoint is public and loads tables into memory.
  if (query.length > 80) query = query.slice(0, 80);

  const lowerQuery = query.toLowerCase();

  let specialties: SearchableSpecialty[] = [];
  let packages: SearchablePackage[] = [];
  try {
    const dbSpecs = await db.orm.public.Specialty.all();
    const dbPkgs = await db.orm.public.Package.all();
    specialties = dbSpecs.length > 0 ? dbSpecs : fallbackSpecialties;
    packages = dbPkgs.length > 0 ? dbPkgs : fallbackPackages;
  } catch {
    specialties = fallbackSpecialties;
    packages = fallbackPackages;
  }

  const results: SearchResult[] = [];

  for (const s of specialties) {
    if (s.name.toLowerCase().includes(lowerQuery) || s.category.toLowerCase().includes(lowerQuery)) {
      results.push({ type: "Specialty", title: s.name, slug: s.slug, href: `/specialties/${s.slug}` });
    }
  }

  for (const p of packages) {
    if (p.name.toLowerCase().includes(lowerQuery) || p.summary.toLowerCase().includes(lowerQuery)) {
      results.push({ type: "Package", title: p.name, slug: p.slug, href: `/packages/${p.slug}` });
    }
  }

  return results.slice(0, 10);
}
