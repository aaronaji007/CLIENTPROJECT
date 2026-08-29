"use server";
import { db } from "@/prisma/db";

export async function searchDb(query: string) {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  
  // Since we don't have full text search setup, we fetch all and filter in memory for this demo.
  // In a real app we'd use Postgres full text search or a search service.
  const specialties = await db.orm.public.Specialty.all();
  const packages = await db.orm.public.Package.all();

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
