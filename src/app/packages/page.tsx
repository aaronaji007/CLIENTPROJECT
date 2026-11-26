import { db } from "@/prisma/db";
import { PackageCollection } from "@/components/collection-filters";
import { packages as fallbackPackages, type TravelPackage } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Packages",
  description: "Coordinated medical travel packages that settle the logistics before you commit.",
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let mappedPackages: TravelPackage[] = [];
  try {
    const allPackages = await db.orm.public.Package.include("specialty").all();
    mappedPackages =
      allPackages.length > 0
        ? allPackages.map((p) => {
            const specObj = p.specialty as { name?: string } | null | undefined;
            return {
              slug: p.slug,
              name: p.name,
              country: p.country,
              city: p.city,
              price: p.price,
              currency: p.currency,
              days: p.days,
              specialty: specObj?.name || p.specialtyId,
              summary: p.summary,
              includes: [...p.includes],
              notes: p.notes,
              photo: p.photo,
            };
          })
        : fallbackPackages;
  } catch (e) {
    console.error("Error fetching packages:", e);
    mappedPackages = fallbackPackages;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Coordinated care programs
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/70">
          Each program bundles the procedure with the coordination around it — accommodation,
          transfers, rehabilitation, and a clear path home.
        </p>
      </div>

      <div className="mt-12">
        <PackageCollection packages={mappedPackages} initialQuery={q} />
      </div>
    </div>
  );
}
