import { notFound } from "next/navigation";
import Link from "next/link";
import { specialties, specialtyFaqs } from "@/lib/data";
import { ArrowIcon } from "@/components/icons";
import { Artwork } from "@/components/artwork";
import { FaqAccordion } from "@/components/faq-accordion";
import { OverrideText } from "@/components/override-text";

export const dynamicParams = false;

export function generateStaticParams() {
  return specialties.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = specialties.find((x) => x.slug === slug);
  if (!s) return { title: "Specialty not found" };
  return { title: s.name, description: s.tagline };
}

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const specialty = specialties.find((s) => s.slug === slug);
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
          <Artwork slug={specialty.slug} kind="hero" label={specialty.category} />
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
            <h2 className="font-display text-2xl font-medium text-ink">Procedures</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {specialty.procedures.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 rounded-sm border border-line bg-white/40 px-4 py-3 text-sm text-ink"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                  {p}
                </li>
              ))}
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
            travelDays={specialty.travelDays}
            outcomes={specialty.outcomes}
            name={specialty.name}
          />
        </aside>
      </div>
    </div>
  );
}

function FactsPanel({
  travelDays,
  outcomes,
  name,
}: {
  travelDays: string;
  outcomes: string;
  name: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-ink p-6 text-paper">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
        At a glance
      </p>
      <dl className="mt-4 space-y-4 text-sm">
        <div>
          <dt className="text-paper/55">Typical stay</dt>
          <dd className="mt-1 font-mono text-lg text-paper">{travelDays}</dd>
        </div>
        <div className="border-t border-paper/15 pt-4">
          <dt className="text-paper/55">Outcomes</dt>
          <dd className="mt-1 text-xs leading-relaxed text-paper/65">{outcomes}</dd>
        </div>
        <div className="border-t border-paper/15 pt-4">
          <dt className="text-paper/55">Coordination</dt>
          <dd className="mt-1 text-paper/80">
            Dedicated case manager · accredited provider · home handoff
          </dd>
        </div>
      </dl>
      <Link
        href={`/packages?q=${name.split(" ")[0].toLowerCase()}`}
        className="mt-6 block w-full rounded-sm bg-signal px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-deep"
      >
        Plan this care
      </Link>
    </div>
  );
}
