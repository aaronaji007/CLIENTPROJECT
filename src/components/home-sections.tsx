"use client";

import { useContentOverrides } from "@/lib/override-context";
import { defaultTrust, defaultStats } from "@/lib/admin-content";
import { testimonials as defaultTestimonials, generalFaqs as defaultFaqs } from "@/lib/data";
import { Marquee } from "@/components/bits/Marquee";
import TextPressure from "@/components/bits/TextPressure";
import DotGrid from "@/components/bits/DotGrid";
import AnimatedContent from "@/components/bits/AnimatedContent";
import CountUp from "@/components/bits/CountUp";
import GradientText from "@/components/bits/GradientText";
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
import SpotlightCard from "@/components/bits/SpotlightCard";
import { ShieldCheck, Plane, HeartPulse, UserRoundCheck } from "lucide-react";

export function HomeTrustMarquee() {
  const ov = useContentOverrides();
  const trust = ov.trust && ov.trust.length > 0 ? ov.trust : defaultTrust;

  return (
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
  );
}

export function HomePressureBand() {
  const ov = useContentOverrides();
  const text = ov.landing?.home?.pressureText || "MedicalCare Beyond Borders";

  return (
    <section className="border-y border-line bg-paper-deep/40 py-6 text-center">
      <div className="mx-auto max-w-4xl px-4 flex items-center justify-center gap-4">
        <span className="hidden sm:block h-px w-12 bg-signal/40" />
        <p className="font-display text-xl sm:text-2xl font-medium tracking-tight text-ink">
          {text}
        </p>
        <span className="hidden sm:block h-px w-12 bg-signal/40" />
      </div>
    </section>
  );
}

export function HomeStatsBand() {
  const ov = useContentOverrides();
  const stats = ov.stats && ov.stats.length > 0 ? ov.stats : defaultStats;

  return (
    <section className="relative overflow-hidden border-y border-line bg-ink dark:bg-[#101412] py-16 text-paper dark:text-ink">
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
        {stats.map((stat, i) => (
          <AnimatedContent key={i} distance={50} className="text-center">
            <div className="font-display text-4xl font-medium text-paper dark:text-ink sm:text-5xl">
              <CountUp to={stat.v} />
              <GradientText className="text-signal">{stat.s}</GradientText>
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 dark:text-ink/65">
              {stat.l}
            </div>
          </AnimatedContent>
        ))}
      </div>
    </section>
  );
}

export function HomePatientStories() {
  const ov = useContentOverrides();
  const testimonials =
    ov.testimonials && ov.testimonials.length > 0 ? ov.testimonials : defaultTestimonials;

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {testimonials.slice(0, 6).map((t, i) => (
        <AnimatedContent key={i} distance={60} delay={i * 0.05}>
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
              <p className="text-sm text-ink/70">&ldquo;{t.quote}&rdquo;</p>
            </CardContent>
          </Card>
        </AnimatedContent>
      ))}
    </div>
  );
}

export function HomeFaqAccordion() {
  const ov = useContentOverrides();
  const faqs = ov.faqs && ov.faqs.length > 0 ? ov.faqs : defaultFaqs;

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.slice(0, 8).map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function HomeHeroBadge() {
  const ov = useContentOverrides();
  const badge = ov.landing?.home?.heroBadge || "MedicalCare Beyond Borders";

  return (
    <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-line bg-paper-deep/60 px-4 py-2 backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
      <span className="font-mono text-xs uppercase tracking-[0.24em] font-semibold text-signal">
        {badge}
      </span>
    </div>
  );
}
