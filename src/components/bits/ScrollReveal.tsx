"use client";

import { useEffect, useRef, useMemo, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
}

export function ScrollReveal({
  children,
  as: Tag = "h2",
  className = "",
  enableBlur = true,
  baseOpacity = 0.12,
  baseRotation = 2,
  blurStrength = 3,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  const words = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, i) =>
      word.match(/^\s+$/) ? word : (
        <span className="inline-block word" key={i}>
          {word}
        </span>
      )
    );
  }, [children]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          ease: "none",
          rotate: 0,
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true },
        }
      );

      const targets = el.querySelectorAll<HTMLElement>(".word");
      gsap.fromTo(
        targets,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.04,
          scrollTrigger: { trigger: el, start: "top bottom-=15%", end: "bottom bottom", scrub: true },
        }
      );

      if (enableBlur) {
        gsap.fromTo(
          targets,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.04,
            scrollTrigger: { trigger: el, start: "top bottom-=15%", end: "bottom bottom", scrub: true },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [enableBlur, baseOpacity, baseRotation, blurStrength]);

  return <Tag ref={ref} className={className}>{words.length ? words : children}</Tag>;
}
