import Link from "next/link";
import { Emblem } from "@/components/header";
import { JourneyTimeline } from "@/components/journey-timeline";
import { ConsultBooking } from "@/components/consult-booking";
import { Artwork } from "@/components/artwork";
import { SpecialtyCard } from "@/components/specialty-card";
import { PackageCard } from "@/components/package-card";
import { specialties, packages, testimonials } from "@/lib/data";

export const metadata = {
  title: "Global Surgery & Care Concierge",
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="bg-ink text-paper" id="journey">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
              Three phases. One point of contact.
            </h2>
            <p className="mt-4 text-paper/70">
              From understanding your condition to recovering at home, the whole passage is
              coordinated on one disciplined timeline.
            </p>
          </div>
          <div className="mt-12 rounded-lg border border-paper/10 bg-paper/[0.03] p-6 sm:p-10">
            <JourneyTimeline inverse />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionHeader
          title="Care where it matters"
          body="Eight coordinated specialty pathways, each with a dedicated case manager from the first conversation."
          cta={{ href: "/specialties", label: "View all specialties" }}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.slice(0, 8).map((s) => (
            <SpecialtyCard
              key={s.slug}
              slug={s.slug}
              category={s.category}
              name={s.name}
              summary={s.summary}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep/40">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <SectionHeader
            title="A plan, not a price list"
            body="Bundled journeys that settle the hard logistics before you commit. Each package shows exactly what is coordinated."
            cta={{ href: "/packages", label: "Browse packages" }}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {packages.slice(0, 3).map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                Patient stories
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
                One point of contact, end to end
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-paper/55">
              Synthetic accounts written for this demonstration. No real patient is quoted.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col justify-between rounded-lg border border-paper/12 bg-paper/[0.04] p-6"
              >
                <blockquote className="font-display text-lg leading-snug text-paper/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-paper/12 pt-4">
                  <p className="text-sm font-medium text-paper">{t.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">
                    {t.care}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28" id="consult">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              title="Begin with a conversation"
              body="A short, timezone-aware consultation with a case manager — in your local time, from wherever you are. Nothing is charged, nothing is decided on a call."
            />
            <ul className="mt-8 space-y-4">
              {[
                ["01", "Tell us your situation", "A few details and any documents you want to share."],
                ["02", "Meet your case manager", "Someone who owns your journey end to end."],
                ["03", "Receive a care plan", "Options, timelines, and a clear next step — in writing."],
              ].map(([n, t, d]) => (
                <li key={n} className="flex gap-4">
                  <span className="font-mono text-sm text-signal">{n}</span>
                  <div>
                    <p className="font-medium text-ink">{t}</p>
                    <p className="text-sm text-ink/65">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ConsultBooking />
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-24">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-paper/25">
            <Emblem />
          </div>
          <p className="mx-auto mt-8 max-w-xl font-display text-3xl font-medium leading-tight sm:text-4xl">
            The hardest part of seeking care abroad should not be the seeking.
          </p>
          <p className="mx-auto mt-4 max-w-lg text-paper/65">
            Let one point of contact hold the whole journey — so you can focus on what
            matters: your health.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/40">
            Carte Clinique · Concept site
          </p>
        </div>
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12px 12px, #0e2a34 1.4px, transparent 1.4px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/20">
                <Emblem />
              </span>
              <div>
                <p className="font-display text-xl font-medium text-ink">Carte Clinique</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Global surgery &amp; care concierge
                </p>
              </div>
            </div>

            <h1 className="mt-10 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-6xl">
              One clinic,
              <br />
              across every border.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
              We coordinate the full journey of treatment abroad — discovery, travel, and
              recovery — through a single point of contact who knows your name, your file, and
              your timeline.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaLink href="/specialties" label="Plan your care" primary />
              <CtaLink href="/packages" label="See coordinated packages" />
            </div>

            <dl className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
              {[
                ["01", "Discovery", "Understand & choose your care"],
                ["02", "Travel", "Visa, flights, transfers as one"],
                ["03", "Recovery", "Treatment, aftercare, handoff home"],
              ].map(([n, t, d]) => (
                <div key={n} className="bg-paper p-4">
                  <dt className="font-mono text-xs text-signal">{n}</dt>
                  <dd className="mt-1.5 font-display text-base font-medium text-ink">{t}</dd>
                  <p className="mt-1 text-xs text-ink/60">{d}</p>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden lg:block">
            <div className="sticky top-24 overflow-hidden rounded-lg border border-line shadow-panel">
              <div className="aspect-[4/4.6] w-full">
                <Artwork slug="carte-clinique" kind="hero" label="Coordinated care" photo="/images/package-hero.webp" />
              </div>
              <HeroCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-paper/20 bg-ink/92 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
            Journey status
          </p>
          <p className="mt-1 font-display text-lg font-medium text-paper">
            Discovery → Travel → Recovery
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-signal/60 bg-signal/90">
          <svg viewBox="0 0 20 20" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 10 h8 M10 6 v8" />
          </svg>
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-paper/60">
        One point of contact owns every stage — from first consult to follow-up at home.
      </p>
    </div>
  );
}

function SectionHeader({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-ink/70">{body}</p>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline"
        >
          {cta.label}
          <ArrowIcon />
        </Link>
      )}
    </div>
  );
}

function CtaLink({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return primary ? (
    <Link
      href={href}
      className="attend-primary inline-flex items-center justify-center rounded-sm bg-signal px-6 py-3 text-base font-semibold text-white shadow-panel transition-colors hover:bg-signal-deep"
    >
      {label}
    </Link>
  ) : (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-sm border border-ink/25 bg-paper px-6 py-3 text-base font-semibold text-ink transition-colors hover:border-ink"
    >
      {label}
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8 H14 M10 4 L14 8 L10 12" />
    </svg>
  );
}
