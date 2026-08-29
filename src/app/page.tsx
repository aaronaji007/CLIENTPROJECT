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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { UserRoundCheck, ShieldCheck, Plane, HeartPulse } from "lucide-react";
import { specialties, packages, testimonials } from "@/lib/data";

import ShinyText from "@/components/bits/ShinyText";
import GradientText from "@/components/bits/GradientText";
import StarBorder from "@/components/bits/StarBorder";
import SpotlightCard from "@/components/bits/SpotlightCard";
import CountUp from "@/components/bits/CountUp";
import BlurText from "@/components/bits/BlurText";
import { Marquee } from "@/components/bits/Marquee";
import LightRays from "@/components/bits/LightRays";
import DotGrid from "@/components/bits/DotGrid";
import ScrollFloat from "@/components/bits/ScrollFloat";
import DecryptedText from "@/components/bits/DecryptedText";
import AnimatedContent from "@/components/bits/AnimatedContent";
import TextPressure from "@/components/bits/TextPressure";
import CircularText from "@/components/bits/CircularText";
import ScrambledText from "@/components/bits/ScrambledText";
import ClickSpark from "@/components/bits/ClickSpark";
import Magnet from "@/components/bits/Magnet";
import { TiltCard } from "@/components/bits/TiltCard";

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

export default function Home() {
  const trust = [
    "JCI-Accredited Partners",
    "GDPR-Aligned Records",
    "Bilingual Care Coordinators",
    "Transparent Flat Pricing",
    "24/7 Recovery Line",
    "Named Clinical Lead",
  ];

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
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3">
              <Emblem className="h-12 w-12" />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">
                The Clinic Charter
              </span>
            </div>
            <Eyebrow>Global surgery &amp; care concierge</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
              <BlurText
                text="Coordinated care across borders"
                delay={120}
                animateBy="words"
              />
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/70">
              A medical-travel concierge that connects international patients
              with vetted providers and coordinates the entire journey — calm,
              documented, and accountable from discovery to recovery.
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
              <Magnet>
                <Link href="/specialties">
                  <Button variant="outline" className="px-6 py-3 text-sm">
                    Explore specialties
                  </Button>
                </Link>
              </Magnet>
            </div>

            <div className="mt-10 flex items-center gap-3 text-ink/60">
              <UserRoundCheck className="h-5 w-5 text-signal" />
              <span className="text-sm">
                A named clinical lead orchestrates every step — from discovery to
                recovery.
              </span>
            </div>
          </div>

          <AnimatedContent distance={70} className="mt-14">
            <TiltCard intensity={8} className="overflow-hidden rounded-2xl border border-line bg-ink/5 shadow-[0_30px_80px_-40px_rgba(44,58,43,0.45)]">
              <div className="aspect-[16/8] w-full">
                <Artwork slug="hero" kind="hero" label="Carte Clinique network" />
              </div>
              <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-ink/70 px-4 py-1.5 backdrop-blur">
                <ShinyText
                  text="Your journey, one guarded document"
                  className="font-mono text-xs tracking-wide text-paper"
                />
              </div>
            </TiltCard>
          </AnimatedContent>
        </div>

        <div className="relative border-t border-line bg-paper py-5">
          <Marquee className="[--marquee-duration:42s]">
            {trust.map((t, i) => (
              <span
                key={i}
                className="mx-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink/55"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                {t}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* PRESSURE WORD BAND */}
      <section className="overflow-hidden border-y border-line bg-paper py-8">
        <TextPressure
          text="Across every border"
          textColor="#2c3a2b"
          className="text-center"
        />
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeader
          title="Why Carte Clinique"
          body="We refuse the crowded medical-travel template. This is a clinic delivering coordinated care — calm, documented, and accountable."
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

        <AnimatedContent distance={60} className="mt-10 max-w-2xl">
          <ScrambledText
            radius={90}
            duration={1.1}
            speed={0.5}
            scrambleChars=".:"
            className="text-ink/70"
          >
            From the first message to your final follow-up, the same person
            holds the thread. Records move with you. Decisions are documented.
            Nothing about your care is left to chance or to a call center.
          </ScrambledText>
        </AnimatedContent>
      </section>

      {/* JOURNEY */}
      <section className="border-y border-line bg-ink/[0.03] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>The journey</Eyebrow>
          <ScrollFloat
            containerClassName="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl"
            textClassName="inline-block"
          >
            Discovery, travel, recovery — one guarded path
          </ScrollFloat>
          <AnimatedContent distance={80} className="mt-12">
            <JourneyTimeline />
          </AnimatedContent>
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
                />
              </TiltCard>
            </AnimatedContent>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="relative overflow-hidden border-y border-line bg-ink py-16 text-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
        >
          <DotGrid
            baseColor="rgba(244,239,226,0.16)"
            activeColor="#b06a3a"
            className="h-full w-full"
          />
        </div>
        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
          {[
            { v: 38, s: "+", l: "Countries coordinated" },
            { v: 120, s: "+", l: "Vetted partner hospitals" },
            { v: 96, s: "%", l: "Patients would refer us" },
            { v: 24, s: "/7", l: "Recovery support line" },
          ].map((stat) => (
            <AnimatedContent key={stat.l} distance={50} className="text-center">
              <div className="font-display text-4xl font-medium text-paper sm:text-5xl">
                <CountUp to={stat.v} />
                <GradientText className="text-signal">{stat.s}</GradientText>
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
                {stat.l}
              </div>
            </AnimatedContent>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeader
          title="Care programs"
          cta={{ label: "Build a program", href: "/consult" }}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {packages.slice(0, 3).map((p, i) => (
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
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <AnimatedContent key={t.name} distance={60} delay={i * 0.05}>
                <Card className="h-full rounded-2xl border-line bg-paper">
                  <CardHeader>
                    <CardTitle className="font-display text-base text-ink">
                      {t.name}
                      <span className="block font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-ink/50">
                        {t.care}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ink/70">“{t.quote}”</p>
                  </CardContent>
                </Card>
              </AnimatedContent>
            ))}
          </div>
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
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Do you perform the surgery?",
                a: "No. We coordinate. Carte Clinique connects you with accredited partner hospitals and specialists; your treating clinician remains independent and fully accountable for your care.",
              },
              {
                q: "How is pricing kept transparent?",
                a: "You receive a single written program price before travel. It covers coordination, logistics, and agreed clinical scopes. Unexpected clinical add-ons are quoted and approved by you first.",
              },
              {
                q: "What happens if recovery is complicated?",
                a: "Your clinical lead stays with the case through recovery and the return home, with a 24/7 line and a documented escalation path to the partner hospital.",
              },
              {
                q: "Is my medical data safe across borders?",
                a: "Records are shared only with your consent and with partners you approve, handled under GDPR-aligned controls, and never sold.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedContent>
      </section>

      {/* CONSULT */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
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
                <div className="relative mt-8 inline-flex">
                  <CircularText
                    text="PLAN YOUR CARE · PLAN YOUR CARE · "
                    spinDuration={16}
                    className="absolute -left-16 -top-16 h-32 w-32 text-signal/70"
                  />
                  <Magnet>
                    <ClickSpark sparkColor="#b06a3a" sparkSize={11}>
                      <Link href="/consult">
                        <StarBorder color="#b06a3a" className="px-6 py-3 text-sm">
                          Start a consult
                        </StarBorder>
                      </Link>
                    </ClickSpark>
                  </Magnet>
                </div>
              </div>
              <div className="rounded-2xl bg-paper/[0.04] p-2">
                <ConsultBooking />
              </div>
            </CardContent>
          </Card>
        </AnimatedContent>
      </section>
    </div>
  );
}
