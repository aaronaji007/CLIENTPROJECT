import Link from "next/link";
import { Emblem } from "@/components/header";
import { JourneyTimeline } from "@/components/journey-timeline";
import { ConsultBooking } from "@/components/consult-booking";
import { Artwork } from "@/components/artwork";
import { SpecialtyCard } from "@/components/specialty-card";
import { PackageCard } from "@/components/package-card";
import { ScrollReveal } from "@/components/bits/ScrollReveal";
import ShinyText from "@/components/bits/ShinyText";
import GradientText from "@/components/bits/GradientText";
import RotatingText from "@/components/bits/RotatingText";
import StarBorder from "@/components/bits/StarBorder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SpotlightCard from "@/components/bits/SpotlightCard";
import CountUp from "@/components/bits/CountUp";
import BlurText from "@/components/bits/BlurText";
import { Marquee } from "@/components/bits/Marquee";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { UserRoundCheck, ShieldCheck, Plane, HeartPulse } from "lucide-react";
import { specialties, packages, testimonials } from "@/lib/data";

export const metadata = {
  title: "Global Surgery & Care Concierge",
};

const features = [
  {
    icon: UserRoundCheck,
    title: "One point of contact",
    body: "A single case manager owns your file from the first call to follow-up at home — no call centres, no hand-offs.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted providers",
    body: "Every hospital and specialist is screened for accreditation, published outcomes, and working language before they ever reach you.",
  },
  {
    icon: Plane,
    title: "Travel, handled",
    body: "Visas, flights, private transfers, and recovery stays are booked as one coordinated itinerary — not a to-do list.",
  },
  {
    icon: HeartPulse,
    title: "Recovery, at home",
    body: "Aftercare plans and local handoffs keep your recovery on track long after you land.",
  },
];

const stats = [
  { to: 42, suffix: "+", label: "Countries coordinated" },
  { to: 1200, suffix: "+", label: "Journeys planned", separator: "," },
  { to: 98, suffix: "%", label: "Would recommend" },
  { to: 24, suffix: "/7", label: "Concierge reach" },
];

const faqs = [
  {
    q: "What exactly does Carte Clinique do?",
    a: "We coordinate medical travel end to end: helping you choose a vetted provider, arranging visas and logistics, and staying with you through recovery. You remain in charge of every clinical decision.",
  },
  {
    q: "Are the prices and outcomes on this site real?",
    a: "No. This is a concept demonstration. Every figure, credential, and testimonial here is a placeholder written to show how the experience would read — nothing is a quote or a medical claim.",
  },
  {
    q: "How is my case manager chosen?",
    a: "By the nature of your condition and destination. One named person is assigned and stays with you across discovery, travel, and recovery so the story of your care is never retold from scratch.",
  },
  {
    q: "What happens if plans change while I am abroad?",
    a: "Your case manager holds the contingency: rebooking, a second opinion, or an extended stay are handled as part of the same coordinated plan rather than as emergencies.",
  },
  {
    q: "Do you take a fee from the hospital?",
    a: "In this demonstration there is no commercial relationship to disclose. In practice we would be explicit about how the service is funded before any commitment is made.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <TrustStrip />

      <Features />

      <StatsBand />

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
            <SpecialtyCard key={s.slug} slug={s.slug} category={s.category} name={s.name} summary={s.summary} />
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
              <Badge
                variant="outline"
                className="border-signal/30 font-mono uppercase tracking-[0.18em] text-[11px] text-signal"
              >
                Patient stories
              </Badge>
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

      <Faq />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28" id="consult">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              title="Begin with a conversation"
              body="A short, timezone-aware consultation with a case manager — in your local time, from wherever you are. Nothing is charged, nothing is decided on a call."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Tell us your situation", "A few details and any documents you want to share."],
                ["02", "Meet your case manager", "Someone who owns your journey end to end."],
                ["03", "Receive a care plan", "Options, timelines, and a clear next step — in writing."],
              ].map(([n, t, d]) => (
                <Card key={n}>
                  <CardHeader>
                    <span className="font-mono text-sm text-signal">{n}</span>
                    <CardTitle className="text-base">{t}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ink/65">{d}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <ConsultBooking />
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-24">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-paper/25">
            <Emblem />
          </div>
          <GradientText
            colors={["#f6f4ef", "#c94f3d", "#f6f4ef"]}
            animationSpeed={6}
            className="mt-8 max-w-xl font-display text-3xl font-medium leading-tight text-center sm:text-4xl"
          >
            The hardest part of seeking care abroad should not be the seeking.
          </GradientText>
          <p className="mx-auto mt-4 max-w-lg text-paper/65">
            Let one point of contact hold the whole journey — so you can focus on what
            matters: your health.
          </p>
          <div className="mt-9 flex justify-center">
            <Link href="/specialties" aria-label="Plan your care" className="attend-primary inline-flex items-center justify-center">
              <StarBorder as="span" speed="5s">
                Plan your care
              </StarBorder>
            </Link>
          </div>
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
          backgroundImage: "radial-gradient(circle at 12px 12px, #0e2a34 1.4px, transparent 1.4px)",
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
                  <ShinyText text="Global surgery & care concierge" color="#163a46" shineColor="#c94f3d" speed={4} />
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
              recovery — through a single point of contact who knows your{" "}
              <span className="inline-flex align-baseline text-signal font-medium">
                <RotatingText texts={["name", "file", "timeline", "story"]} />
              </span>
              .
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/specialties" aria-label="Plan your care" className="attend-primary inline-flex items-center justify-center">
                <StarBorder as="span" speed="5s">
                  Plan your care
                </StarBorder>
              </Link>
              <Button asChild variant="outline" size="lg" className="font-semibold">
                <Link href="/packages">
                  See coordinated packages
                  <ArrowIcon />
                </Link>
              </Button>
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
            <SpotlightCard className="sticky top-24 overflow-hidden rounded-lg border border-line shadow-panel">
              <div className="aspect-[4/4.6] w-full">
                <Artwork slug="carte-clinique" kind="hero" label="Coordinated care" photo="/images/package-hero.webp" />
              </div>
              <HeroCard />
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    "JCI Accredited",
    "ISO 9001",
    "42 Countries",
    "English-Speaking Teams",
    "24/7 Concierge",
    "Visa & Travel Handled",
    "Aftercare Included",
    "Single Case Manager",
  ];
  return (
    <section className="border-b border-line bg-paper-deep/40 py-6">
      <div className="mx-auto max-w-6xl px-5">
        <Marquee duration={36} pauseOnHover>
          {items.map((item) => (
            <span
              key={item}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55"
            >
              {item}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <BlurText
        text="Why Carte Clinique"
        className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl"
        animateBy="words"
      />
      <p className="mt-4 max-w-2xl text-ink/70">
        The category sells logistics. We sell a single person who refuses to let the
        logistics become yours.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <SpotlightCard key={title} className="p-6">
            <Icon className="h-7 w-7 text-signal" strokeWidth={1.6} />
            <h3 className="mt-5 font-display text-lg font-medium text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{body}</p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="border-y border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 py-14 sm:grid-cols-4">
        {stats.map(({ to, suffix, label, separator }) => (
          <div key={label} className="px-2 text-center">
            <p className="font-display text-4xl font-medium sm:text-5xl">
              <CountUp to={to} separator={separator} duration={2} />
              <span className="text-signal">{suffix}</span>
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 sm:py-28">
      <ScrollReveal as="h2" className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
        Considered questions, answered plainly.
      </ScrollReveal>
      <Accordion type="single" collapsible className="mt-8">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-paper/20 bg-ink/92 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">Journey status</p>
          <p className="mt-1 font-display text-lg font-medium text-paper">Discovery → Travel → Recovery</p>
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
        <ScrollReveal as="h2" className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
          {title}
        </ScrollReveal>
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8 H14 M10 4 L14 8 L10 12" />
    </svg>
  );
}
