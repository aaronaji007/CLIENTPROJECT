import "dotenv/config";
import { db } from "../src/prisma/db.js";
import { specialties, packages } from "../src/lib/data.js";

async function sync() {
  console.log("Starting database synchronization with business requirements...");

  // 1. Delete removed packages
  try {
    const oldCoronary = await db.orm.public.Package.where({ slug: "coronary-bypass" }).first();
    if (oldCoronary) {
      await db.orm.public.Package.where({ slug: "coronary-bypass" }).delete();
      console.log("Deleted package: coronary-bypass");
    }
  } catch (e) {
    console.error("Error deleting coronary-bypass package:", e);
  }

  // 2. Delete removed specialties: cardiology, neurosurgery
  const toRemove = ["cardiology", "neurosurgery"];
  for (const slug of toRemove) {
    try {
      const existing = await db.orm.public.Specialty.where({ slug }).first();
      if (existing) {
        // Delete any packages linked to this specialty first
        await db.orm.public.Package.where({ specialtyId: existing.id }).deleteAll();
        await db.orm.public.Specialty.where({ slug }).delete();
        console.log(`Deleted specialty: ${slug}`);
      }
    } catch (e) {
      console.error(`Error deleting specialty ${slug}:`, e);
    }
  }

  // 3. Upsert specialties
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
        console.log(`Updated specialty: ${s.slug}`);
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
        console.log(`Created specialty: ${s.slug}`);
      }
    } catch (e) {
      console.error(`Error upserting specialty ${s.slug}:`, e);
    }
  }

  // 4. Upsert packages
  const allSpecs = await db.orm.public.Specialty.all();
  for (const p of packages) {
    // Find matching specialty
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
        console.log(`Updated package: ${p.slug} -> linked to ${matchedSpec.slug}`);
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
        console.log(`Created package: ${p.slug} -> linked to ${matchedSpec.slug}`);
      }
    } catch (e) {
      console.error(`Error upserting package ${p.slug}:`, e);
    }
  }

  console.log("Database synchronization completed successfully!");
}

sync().catch(console.error);
