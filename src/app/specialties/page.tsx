import { db } from "@/prisma/db";
import { SpecialtyCollection } from "@/components/collection-filters";

export const metadata = {
  title: "Specialties",
  description: "Coordinated specialty pathways, each with a dedicated case manager.",
};

export default async function SpecialtiesPage() {
  const rawSpecialties = await db.orm.public.Specialty.all();
  const allSpecialties = rawSpecialties.map(s => ({
    ...s,
    procedures: s.procedures as string[],
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Eight pathways, one standard of care
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/70">
          Every specialty is matched to an accredited provider and a dedicated case manager
          who coordinates the whole journey — not just the procedure.
        </p>
      </div>

      <div className="mt-12">
        <SpecialtyCollection specialties={allSpecialties} />
      </div>
    </div>
  );
}
