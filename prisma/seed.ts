import 'dotenv/config';
import { db } from '../src/prisma/db.js';
import { specialties, packages } from '../src/lib/data.js';

async function main() {
  console.log('Seeding database with updated business requirements...');

  // 1. Remove obsolete packages and specialties
  try {
    await db.orm.public.Package.where({ slug: "coronary-bypass" }).delete();
  } catch {}

  for (const slug of ["cardiology", "neurosurgery"]) {
    try {
      const existing = await db.orm.public.Specialty.where({ slug }).first();
      if (existing) {
        await db.orm.public.Package.where({ specialtyId: existing.id }).deleteAll();
        await db.orm.public.Specialty.where({ slug }).delete();
      }
    } catch {}
  }

  // 2. Upsert specialties
  for (const s of specialties) {
    try {
      const existing = await db.orm.public.Specialty.where({ slug: s.slug }).first();
      if (existing) {
        await db.orm.public.Specialty.where({ slug: s.slug }).update({
          category: s.category,
          name: s.name,
          tagline: s.tagline,
          summary: s.summary,
          overview: s.overview,
          procedures: s.procedures,
          recovery: s.recovery,
          outcomes: s.outcomes,
          travelDays: s.travelDays,
          photo: s.photo,
        });
      } else {
        await db.orm.public.Specialty.create({
          slug: s.slug,
          category: s.category,
          name: s.name,
          tagline: s.tagline,
          summary: s.summary,
          overview: s.overview,
          procedures: s.procedures,
          recovery: s.recovery,
          outcomes: s.outcomes,
          travelDays: s.travelDays,
          photo: s.photo,
        });
      }
    } catch (e) {
      console.log('Skipped specialty', s.slug, e);
    }
  }

  // 3. Upsert packages
  const allSpecs = await db.orm.public.Specialty.all();
  for (const p of packages) {
    let matchedSpec = allSpecs.find(
      (s) =>
        s.slug === p.specialty.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
        s.category.toLowerCase().includes(p.specialty.toLowerCase().slice(0, 5)) ||
        s.name.toLowerCase().includes(p.specialty.toLowerCase().slice(0, 5))
    );
    if (!matchedSpec && p.specialty.includes("Dental")) {
      matchedSpec = allSpecs.find((s) => s.slug === "dental");
    }
    if (!matchedSpec) {
      matchedSpec = allSpecs[0];
    }

    if (matchedSpec) {
      try {
        const existing = await db.orm.public.Package.where({ slug: p.slug }).first();
        if (existing) {
          await db.orm.public.Package.where({ slug: p.slug }).update({
            name: p.name,
            country: p.country,
            city: p.city,
            price: p.price,
            currency: p.currency,
            days: p.days,
            specialtyId: matchedSpec.id,
            summary: p.summary,
            includes: p.includes,
            notes: p.notes,
            photo: p.photo,
          });
        } else {
          await db.orm.public.Package.create({
            slug: p.slug,
            name: p.name,
            country: p.country,
            city: p.city,
            price: p.price,
            currency: p.currency,
            days: p.days,
            specialtyId: matchedSpec.id,
            summary: p.summary,
            includes: p.includes,
            notes: p.notes,
            photo: p.photo,
          });
        }
      } catch (e) {
        console.log('Skipped package', p.slug, e);
      }
    }
  }
  console.log('Database seeded with business requirements!');
}

main().catch(console.error);
