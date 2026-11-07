import Link from "next/link";
import { Emblem } from "@/components/header";
import { JourneyTimeline } from "@/components/journey-timeline";
import { ConsultBooking } from "@/components/consult-booking";
import { Artwork } from "@/components/artwork";
import { SpecialtyCard } from "@/components/specialty-card";
import { PackageCard } from "@/components/package-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { UserRoundCheck, ShieldCheck, Plane, HeartPulse } from "lucide-react";
import { specialties as fallbackSpecialties, packages as fallbackPackages } from "@/lib/data";
import SpotlightCard from "@/components/bits/SpotlightCard";
import ScrollFloat from "@/components/bits/ScrollFloat";
import AnimatedContent from "@/components/bits/AnimatedContent";
import { TiltCard } from "@/components/bits/TiltCard";
import { OverrideText } from "@/components/override-text";
import { db } from "@/prisma/db";
import {
  HomeTrustMarquee,
  HomePressureBand,
  HomeStatsBand,
  HomePatientStories,
  HomeFaqAccordion,
  HomeHeroBadge,
} from "@/components/home-sections";

export const dynamic = "force-dynamic";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal font-semibold">
      {children}
    </p>
  );
}

function SectionHeader({
  title,
  body,
  cta,
}: {
  title: string;
  body?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <ScrollFloat
          containerClassName="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl"
          textClassName="inline-block"
        >
          {title}
        </ScrollFloat>
        {body ? <p className="mt-4 text-ink/70">{body}</p> : null}
      </div>
      {cta ? (
        <Link
          href={cta.href}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink/70 hover:text-ink"
        >
          {cta.label}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      ) : null}
    </div>
  );
}

export default async function Home() {
  let specialties = [];
  let packages = [];

  try {
    const rawSpecialties = await db.orm.public.Specialty.all();
    specialties = rawSpecialties.map((s) => ({
      ...s,
      procedures: (s.procedures as string[]) || [],
    }));

    const rawPackagesQuery = await db.orm.public.Package.include("specialty").all();
    const rawPackages = rawPackagesQuery.sort((a, b) => a.days - b.days);
    packages = rawPackages.map((p) => ({
      ...p,
      specialty: (p.specialty as any)?.name || p.specialtyId,
      includes: (p.includes as string[]) || [],
    }));
  } catch (err) {
    console.error("Home DB fetch error:", err);
    specialties = fallbackSpecialties;
    packages = fallbackPackages;
  }

  return (
    <div className="bg-paper">
      {/* HERO */}
      <section className="relative overflow-hidden bg-paper border-b border-line">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 sm:py-20 lg:grid-cols-12">
          <div className="max-w-xl lg:col-span-7">
            <HomeHeroBadge />
            <Eyebrow>Healthcare &amp; Medical Tourism Concierge</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
              <OverrideText kind="landing" slug="home" field="heroTitle">
                MedicalCare Beyond Borders
              </OverrideText>
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink/75 max-w-xl">
              <OverrideText kind="landing" slug="home" field="heroSubtitle">
                MedyCare 2₹ism connects patients with leading accredited hospitals across borders. Clear clinical paths, documented pricing, and a single coordinator from first review through full recovery.
              </OverrideText>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/consult"
                className="inline-flex items-center gap-2 rounded-sm bg-signal px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-signal-deep transition-all hover:translate-y-[-1px]"
              >
                Plan your care
                <span>→</span>
              </Link>
              <Link
                href="/specialties"
                className="inline-flex items-center gap-2 rounded-sm border border-ink/20 bg-white/50 dark:bg-paper-deep dark:text-ink px-5 py-3.5 text-sm font-medium text-ink hover:border-ink hover:bg-white/80 dark:hover:bg-paper-deep/80 transition-all"
              >
                Browse specialties &amp; surgeries
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-line/60 text-xs text-ink/65 font-mono">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                <span>Zero Waitlists</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                <span>Board-Certified Surgeons</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                <span>Transparent Flat Pricing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-line bg-paper-deep/70 p-6 sm:p-8 shadow-panel backdrop-blur space-y-5">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white dark:bg-paper-deep p-1 border border-line shadow-sm">
                  <Emblem className="h-7 w-auto" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-semibold">
                    The Concierge Promise
                  </p>
                  <h3 className="font-display text-xl font-medium text-ink">
                    Continuity of Care Guarantee
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-ink/75">
                <OverrideText kind="landing" slug="home" field="scrambledText">
                  From the first message to your final follow-up, the same dedicated case manager holds the thread. Records move with you. Decisions are documented. Nothing about your care is left to chance or to a call center.
                </OverrideText>
              </p>

              <div className="space-y-2.5 pt-2 border-t border-line/60">
                <div className="flex items-start gap-2.5 text-xs text-ink/80">
                  <span className="text-signal font-bold">✓</span>
                  <span><strong>Named Coordinator:</strong> Communicates directly in your local timezone</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-ink/80">
                  <span className="text-signal font-bold">✓</span>
                  <span><strong>JCI-Accredited Centers:</strong> Vetted partner surgical hospitals</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-ink/80">
                  <span className="text-signal font-bold">✓</span>
                  <span><strong>Fixed Care Plan:</strong> Written surgical and travel estimates upfront</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-ink/80">
                  <span className="text-signal font-bold">✓</span>
                  <span><strong>Home Handoff:</strong> Telemetry reviews and structured physiotherapy</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/#journey"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-signal hover:underline font-semibold"
                >
                  Explore the 3-phase journey timeline →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST BADGES MARQUEE */}
        <HomeTrustMarquee />
      </section>

      {/* PRESSURE WORD BAND */}
      <HomePressureBand />

      {/* WHY */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeader
          title="Why MedyCare 2₹ism"
          body="We refuse the crowded medical-travel template. This is healthcare delivering coordinated care — calm, documented, and accountable beyond borders."
        />
        <AnimatedContent distance={80} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Vetted providers",
              body: "Every partner is credentialed, accredited, and reference-checked before a single patient is referred.",
            },
            {
              icon: Plane,
              title: "Travel, handled",
              body: "Flights, stays, transfers, and recovery lodging are arranged around your clinical schedule — not the other way around.",
            },
            {
              icon: HeartPulse,
              title: "One clinical lead",
              body: "A named coordinator owns your case end to end and is reachable through a single 24/7 line.",
            },
            {
              icon: UserRoundCheck,
              title: "Aligned incentives",
              body: "Flat, transparent pricing. We are paid to coordinate your care, never to upsell a procedure.",
            },
          ].map((f) => (
            <SpotlightCard
              key={f.title}
              spotlightColor="rgba(201,79,61,0.18)"
              className="flex h-full flex-col gap-3 rounded-xl border border-line bg-paper p-5"
            >
              <f.icon className="h-6 w-6 text-signal" />
              <h3 className="font-display text-lg text-ink">{f.title}</h3>
              <p className="text-sm text-ink/65">{f.body}</p>
            </SpotlightCard>
          ))}
        </AnimatedContent>
      </section>

      {/* JOURNEY TIMELINE */}
      <section id="journey" className="border-t border-line bg-ink/[0.02] py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl">
            <Eyebrow>The coordinated path</Eyebrow>
            <ScrollFloat
              containerClassName="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl"
              textClassName="inline-block"
            >
              Every step on one timeline
            </ScrollFloat>
            <p className="mt-4 text-lg text-ink/70">
              Three phases, one clinical lead. You always know what has been decided, what is
              happening next, and who is accountable.
            </p>
          </div>

          <div className="mt-14 sm:mt-18">
            <JourneyTimeline />
          </div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeader
          title="Specialties we coordinate"
          body="A focused set of high-need programs, each with a dedicated clinical pathway."
          cta={{ label: "All specialties", href: "/specialties" }}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.slice(0, 8).map((s, i) => (
            <AnimatedContent key={s.slug} distance={70} delay={i * 0.04}>
              <TiltCard intensity={9} className="h-full">
                <SpecialtyCard
                  slug={s.slug}
                  category={s.category}
                  name={s.name}
                  summary={s.summary}
                  photo={s.photo}
                />
              </TiltCard>
            </AnimatedContent>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <HomeStatsBand />

      {/* PACKAGES */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeader
          title="Care programs"
          cta={{ label: "Build a program", href: "/consult" }}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {packages.slice(0, 6).map((p, i) => (
            <AnimatedContent key={p.slug} distance={70} delay={i * 0.05}>
              <TiltCard intensity={7} className="h-full">
                <SpotlightCard
                  spotlightColor="rgba(184,196,192,0.2)"
                  className="h-full rounded-2xl border border-line bg-paper p-6"
                >
                  <PackageCard pkg={p} />
                </SpotlightCard>
              </TiltCard>
            </AnimatedContent>
          ))}
        </div>
      </section>

      {/* PATIENT STORIES */}
      <section className="border-y border-line bg-ink/[0.03] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader title="Patient stories" />
          <HomePatientStories />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
        <Eyebrow>Questions</Eyebrow>
        <ScrollFloat
          containerClassName="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl"
          textClassName="inline-block"
        >
          Before you plan your care
        </ScrollFloat>
        <AnimatedContent distance={60} className="mt-8">
          <HomeFaqAccordion />
        </AnimatedContent>
      </section>

      {/* CONSULT */}
      <section id="consult" className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
        <AnimatedContent distance={70}>
          <Card className="overflow-hidden rounded-3xl border border-line bg-[#18231c] dark:bg-[#121614] text-paper dark:text-ink">
            <CardContent className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <Eyebrow>Your first step</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-medium text-paper dark:text-ink sm:text-4xl">
                  Tell us what you need
                </h2>
                <p className="mt-4 text-paper/70 dark:text-ink/75">
                  A short, confidential form. No commitment, no sales call — a
                  clinical lead replies with a realistic path and a written
                  estimate.
                </p>
                <div className="mt-8 flex flex-col gap-3 font-mono text-xs uppercase tracking-wider text-paper/80 dark:text-ink/80">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    Board-certified clinical lead assigned to your case
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    Fixed, transparent pricing before you fly
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    Coordinated travel, hospital stay, and aftercare
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-paper/10 dark:border-line bg-paper/5 dark:bg-white/5 p-6 backdrop-blur sm:p-8">
                <ConsultBooking />
              </div>
            </CardContent>
          </Card>
        </AnimatedContent>
      </section>
    </div>
  );
}
