import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/prisma/db";
import { specialtyFaqs, specialties as fallbackSpecialties } from "@/lib/data";
import { ArrowIcon } from "@/components/icons";
import { Artwork } from "@/components/artwork";
import { FaqAccordion } from "@/components/faq-accordion";
import { OverrideText } from "@/components/override-text";

export const dynamic = "force-dynamic";

type ResolvedSpecialty = {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  summary: string;
  overview: string;
  procedures: readonly string[];
  recovery: string;
  outcomes: string;
  photo: string;
};

async function findSpecialty(slug: string): Promise<ResolvedSpecialty | null> {
  try {
    const dbRow = await db.orm.public.Specialty.where({ slug }).first();
    if (dbRow) return dbRow;
  } catch {
    /* fallback below */
  }
  return fallbackSpecialties.find((s) => s.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await findSpecialty(slug);
  if (!s) return { title: "Specialty not found" };
  return { title: s.name, description: s.tagline };
}

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const specialty = await findSpecialty(slug);
  if (!specialty) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <Link
        href="/specialties"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
      >
        <ArrowIcon direction="left" /> All specialties
      </Link>

      <div className="mt-8 overflow-hidden rounded-lg border border-line shadow-panel">
        <div className="aspect-[21/7] w-full">
          <Artwork slug={specialty.slug} kind="hero" label={specialty.category} photo={specialty.photo} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
            {specialty.category}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
            <OverrideText kind="specialties" slug={specialty.slug} field="name">
              {specialty.name}
            </OverrideText>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">{specialty.tagline}</p>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-medium text-ink">Overview</h2>
            <p className="mt-3 leading-relaxed text-ink/75">{specialty.overview}</p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-medium text-ink">
              Procedures
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {specialty.procedures.map((p) => {
                const procName = p.split(/\s*·\s*|\s*—\s*/)[0].trim();
                return (
                  <li
                    key={p}
                    className="flex items-center gap-2.5 rounded-sm border border-line bg-white/40 dark:bg-paper-deep/60 px-4 py-3 text-sm text-ink shadow-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" aria-hidden="true" />
                    <span className="font-medium">{procName}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-medium text-ink">Recovery</h2>
            <p className="mt-3 leading-relaxed text-ink/75">{specialty.recovery}</p>
          </section>

          {specialtyFaqs[specialty.slug] && (
            <section className="mt-14" id="faq">
              <h2 className="font-display text-2xl font-medium text-ink">
                Common questions
              </h2>
              <div className="mt-4">
                <FaqAccordion items={specialtyFaqs[specialty.slug]} />
              </div>
              <Link
                href="/faq"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                View all FAQs <ArrowIcon />
              </Link>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FactsPanel
            outcomes={specialty.outcomes}
            name={specialty.name}
          />
        </aside>
      </div>
    </div>
  );
}

function FactsPanel({
  outcomes,
  name,
}: {
  outcomes: string;
  name: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-[#18231c] dark:bg-[#121614] p-6 text-[#f4efe2]">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#f4efe2]/60">
        At a glance
      </p>
      <dl className="mt-4 space-y-4 text-sm">
        <div>
          <dt className="text-[#f4efe2]/60">Outcomes</dt>
          <dd className="mt-1 text-xs leading-relaxed text-[#f4efe2]/80">{outcomes}</dd>
        </div>
        <div className="border-t border-[#f4efe2]/15 pt-4">
          <dt className="text-[#f4efe2]/60">Coordination</dt>
          <dd className="mt-1 text-[#f4efe2]/90">
            Dedicated case manager · accredited provider · home handoff
          </dd>
        </div>
      </dl>
      <Link
        href={`/packages?q=${encodeURIComponent(name.split(" ")[0].toLowerCase())}`}
        className="mt-6 block w-full rounded-sm bg-signal px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-deep"
      >
        Plan this care
      </Link>
    </div>
  );
}
