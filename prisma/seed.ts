import 'dotenv/config';
import { db } from '../src/prisma/db.js';
import { specialties, packages } from '../src/lib/data.js';

async function main() {
  console.log('Seeding database...');
  for (const s of specialties) {
    try {
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
    } catch (e) { console.log('Skipped specialty', s.slug); }
  }

  for (const p of packages) {
    const specialty = await db.orm.public.Specialty
      .where({ slug: p.specialty.toLowerCase().replace(/[^a-z0-9]+/g, '-') })
      .first();
    
    // Some mock data specialties might not match exactly, fallback to first if not found
    let specId = specialty?.id;
    if (!specId) {
       const anySpec = await db.orm.public.Specialty.first();
       specId = anySpec?.id;
    }

    if (specId) {
      try {
        await db.orm.public.Package.create({
          slug: p.slug,
          name: p.name,
          country: p.country,
          city: p.city,
          price: p.price,
          currency: p.currency,
          days: p.days,
          specialtyId: specId,
          summary: p.summary,
          includes: p.includes,
          notes: p.notes,
          photo: p.photo,
        });
      } catch (e) { console.log('Skipped package', p.slug); }
    }
  }
  console.log('Database seeded!');
}

main().catch(console.error);
