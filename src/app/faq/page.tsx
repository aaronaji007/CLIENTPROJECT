import Link from "next/link";
import { generalFaqs, specialtyFaqs, specialties } from "@/lib/data";
import { FaqAccordion } from "@/components/faq-accordion";
import { ArrowIcon } from "@/components/icons";

export const metadata = {
  title: "FAQ",
  description: "Answers to common questions about planning coordinated care abroad.",
};

export default function FaqPage() {
  const onFaq = specialties.filter((s) => specialtyFaqs[s.slug]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">Good to know</p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Questions, answered plainly
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/70">
          The questions people most often ask before planning care abroad — answered in plain
          terms. This is a concept site, so clinical details remain labeled placeholders.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium text-ink">About the service</h2>
        <div className="mt-4">
          <FaqAccordion items={generalFaqs} />
        </div>
      </section>

      {onFaq.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-medium text-ink">By specialty</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {onFaq.map((s) => (
              <Link
                key={s.slug}
                href={`/specialties/${s.slug}#faq`}
                className="group flex items-center justify-between rounded-lg border border-line bg-paper p-5 shadow-panel transition-transform hover:-translate-y-0.5"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                    {s.category}
                  </p>
                  <p className="mt-1 font-display text-lg font-medium text-ink">{s.name}</p>
                  <p className="mt-1 text-sm text-ink/55">
                    {specialtyFaqs[s.slug].length} common question
                    {specialtyFaqs[s.slug].length === 1 ? "" : "s"}
                  </p>
                </div>
                <ArrowIcon />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 rounded-lg border border-line bg-paper-deep/50 p-6">
        <h2 className="font-display text-xl font-medium text-ink">Still have a question?</h2>
        <p className="mt-2 text-sm text-ink/65">
          Send it to a case manager and we will follow up in your local time.
        </p>
        <Link
          href="/#consult"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline"
        >
          Begin with a conversation <ArrowIcon />
        </Link>
      </section>
    </div>
  );
}
