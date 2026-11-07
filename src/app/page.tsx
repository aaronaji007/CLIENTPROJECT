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
import ShinyText from "@/components/bits/ShinyText";
import GradientText from "@/components/bits/GradientText";
import StarBorder from "@/components/bits/StarBorder";
import SpotlightCard from "@/components/bits/SpotlightCard";
import BlurText from "@/components/bits/BlurText";
import LightRays from "@/components/bits/LightRays";
import ScrollFloat from "@/components/bits/ScrollFloat";
import DecryptedText from "@/components/bits/DecryptedText";
import AnimatedContent from "@/components/bits/AnimatedContent";
import ScrambledText from "@/components/bits/ScrambledText";
import ClickSpark from "@/components/bits/ClickSpark";
import Magnet from "@/components/bits/Magnet";
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
    <DecryptedText
      text={typeof children === "string" ? children : ""}
      animateOn="view"
      speed={40}
      className="font-mono text-xs uppercase tracking-[0.28em] text-signal"
    />
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
      <section className="relative overflow-hidden bg-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          aria-hidden="true"
        >
          <LightRays
            raysColor="#3e4f3a"
            raysOrigin="top-center"
            raysSpeed={0.8}
            lightMode={false}
            className="h-full w-full"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-line" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2">
          <div className="max-w-xl">
            <HomeHeroBadge />
            <Eyebrow>MedyCare 2₹ism · Healthcare &amp; Medical Tourism</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
              <OverrideText kind="landing" slug="home" field="heroTitle">
                <BlurText
                  text="MedicalCare Beyond Borders"
                  delay={120}
                  animateBy="words"
                />
              </OverrideText>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/70 sm:mt-8 sm:text-xl">
              <OverrideText kind="landing" slug="home" field="heroSubtitle">
                MedyCare 2₹ism is a premier medical-travel concierge connecting international patients
                with vetted world-class hospitals and coordinating the entire journey — calm,
                documented, and accountable from discovery to recovery.
              </OverrideText>
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnet>
                <ClickSpark sparkColor="#b06a3a" sparkSize={11} sparkRadius={18}>
                  <Link href="/consult">
                    <StarBorder
                      color="#b06a3a"
                      className="px-6 py-3 text-sm font-medium"
                    >
                      Plan your care
                    </StarBorder>
                  </Link>
                </ClickSpark>
              </Magnet>
              <Link
                href="/specialties"
                className="font-mono text-xs uppercase tracking-[0.2em] text-ink/70 hover:text-ink"
              >
                Browse specialties →
              </Link>
            </div>
          </div>

          <AnimatedContent distance={60}>
            <TiltCard
              intensity={12}
              className="relative overflow-hidden rounded-3xl border border-line bg-paper-deep p-8 shadow-panel"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/20">
                  <Emblem />
                </span>
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink/60">
                    The Promise
                  </div>
                  <div className="font-display text-xl font-medium text-ink">
                    Continuity of Care
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-ink p-6 text-paper">
                <ScrambledText
                  speed={0.5}
                  className="font-mono text-xs tracking-wide text-paper"
                >
                  <p>
                    <OverrideText kind="landing" slug="home" field="scrambledText">
                      From the first message to your final follow-up, the same person holds the thread. Records move with you. Decisions are documented. Nothing about your care is left to chance or to a call center.
                    </OverrideText>
                  </p>
                </ScrambledText>
              </div>
            </TiltCard>
          </AnimatedContent>
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
          <Card className="overflow-hidden rounded-3xl border-line bg-ink text-paper">
            <CardContent className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <Eyebrow>Your first step</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-medium text-paper sm:text-4xl">
                  <BlurText text="Tell us what you need" delay={80} animateBy="words" />
                </h2>
                <p className="mt-4 text-paper/70">
                  A short, confidential form. No commitment, no sales call — a
                  clinical lead replies with a realistic path and a written
                  estimate.
                </p>
                <div className="mt-8 flex flex-col gap-3 font-mono text-xs uppercase tracking-wider text-paper/80">
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

              <div className="rounded-2xl border border-paper/10 bg-paper/5 p-6 backdrop-blur sm:p-8">
                <ConsultBooking />
              </div>
            </CardContent>
          </Card>
        </AnimatedContent>
      </section>
    </div>
  );
}
