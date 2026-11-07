import { db } from "@/prisma/db";
import { PackageCollection } from "@/components/collection-filters";
import { packages as fallbackPackages } from "@/lib/data";

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

  let mappedPackages = [];
  try {
    const allPackages = await db.orm.public.Package.include("specialty").all();
    mappedPackages = allPackages.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      country: p.country,
      city: p.city,
      price: p.price,
      currency: p.currency,
      days: p.days,
      specialtyId: p.specialtyId,
      specialty: (p.specialty as any)?.name || p.specialtyId,
      summary: p.summary,
      includes: (p.includes as string[]) || [],
      notes: p.notes,
      photo: p.photo,
    }));
  } catch (e) {
    console.error("Error fetching packages:", e);
    mappedPackages = fallbackPackages;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          A plan, not a price list
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/70">
          Each package bundles the procedure with the coordination around it — accommodation,
          transfers, rehabilitation, and a clear path home.
        </p>
      </div>

      <div className="mt-12">
        <PackageCollection packages={mappedPackages} initialQuery={q} />
      </div>
    </div>
  );
}
