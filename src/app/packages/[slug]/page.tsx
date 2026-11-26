import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/prisma/db";
import { packages as fallbackPackages } from "@/lib/data";
import { ArrowIcon } from "@/components/icons";
import { Artwork } from "@/components/artwork";
import { OverrideText } from "@/components/override-text";

export const dynamic = "force-dynamic";

type ResolvedPackage = {
  slug: string;
  name: string;
  specialtyName: string;
  summary: string;
  includes: readonly string[];
  notes: string;
  photo: string;
};

async function findPackage(slug: string): Promise<ResolvedPackage | null> {
  try {
    const dbRow = await db.orm.public.Package.include("specialty").where({ slug }).first();
    if (dbRow) {
      const specObj = dbRow.specialty as { name?: string } | null | undefined;
      return {
        slug: dbRow.slug,
        name: dbRow.name,
        specialtyName: specObj?.name || dbRow.specialtyId,
        summary: dbRow.summary,
        includes: [...dbRow.includes],
        notes: dbRow.notes,
        photo: dbRow.photo,
      };
    }
  } catch {
    /* fallback below */
  }
  const fb = fallbackPackages.find((p) => p.slug === slug);
  if (!fb) return null;
  return {
    slug: fb.slug,
    name: fb.name,
    specialtyName: fb.specialty,
    summary: fb.summary,
    includes: fb.includes,
    notes: fb.notes,
    photo: fb.photo,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await findPackage(slug);
  if (!p) return { title: "Package not found" };
  return { title: p.name, description: p.summary };
}

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await findPackage(slug);
  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <Link
        href="/packages"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
      >
        <ArrowIcon direction="left" /> All packages
      </Link>

      <div className="mt-8 overflow-hidden rounded-lg border border-line shadow-panel">
        <div className="aspect-[21/7] w-full">
          <Artwork slug={pkg.slug} kind="hero" label={pkg.specialtyName || pkg.name} photo={pkg.photo} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal">
            {pkg.specialtyName}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
            <OverrideText kind="packages" slug={pkg.slug} field="name">
              {pkg.name}
            </OverrideText>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            <OverrideText kind="packages" slug={pkg.slug} field="summary">
              {pkg.summary}
            </OverrideText>
          </p>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-medium text-ink">What&apos;s coordinated</h2>
            <ul className="mt-4 space-y-3">
              {pkg.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {pkg.notes && (
            <section className="mt-10 rounded-sm bg-signal/5 px-5 py-4 ring-1 ring-signal/20">
              <p className="text-sm font-medium text-signal-deep dark:text-signal">Program overview</p>
              <p className="mt-1 text-sm text-ink/65">{pkg.notes}</p>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-line bg-[#18231c] dark:bg-[#121614] text-[#f4efe2]">
            <div className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#f4efe2]/60">
                Care Program
              </p>
              <p className="mt-2 font-display text-2xl font-medium text-[#f4efe2]">
                Tailored to your clinical needs
              </p>
              <p className="mt-1 text-xs text-[#f4efe2]/65">
                All-inclusive coordinated care pathway
              </p>
              <div className="mt-5 space-y-3 border-t border-[#f4efe2]/15 pt-5 text-sm text-[#f4efe2]/85">
                <p className="flex justify-between gap-4">
                  <span className="text-[#f4efe2]/60">Specialty</span>
                  <span className="text-right">{pkg.specialtyName}</span>
                </p>
                <p className="flex justify-between gap-4 pt-2 border-t border-[#f4efe2]/10">
                  <span className="text-[#f4efe2]/60">Coordination</span>
                  <span className="text-right text-xs">Case lead &amp; aftercare included</span>
                </p>
              </div>
            </div>
            <Link
              href="/consult"
              className="block w-full bg-signal px-6 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-deep border-t border-[#f4efe2]/10"
            >
              Plan this journey
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
