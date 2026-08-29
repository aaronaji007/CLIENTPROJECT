"use client";

import { useEffect, useRef, useState } from "react";
import { journeyPhases } from "@/lib/data";

export function JourneyTimeline({ inverse = false }: { inverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const phaseRefs = useRef<(HTMLElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [line, setLine] = useState({ top: 0, len: 0 });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - (window.innerHeight * 0.5);
        const scrolled = Math.min(Math.max(-rect.top + window.innerHeight * 0.25, 0), total);
        setProgress(total > 0 ? scrolled / total : 0);

        const nodes = phaseRefs.current;
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (firstNode && lastNode) {
          const fTop = firstNode.getBoundingClientRect().top - rect.top + 17;
          const lTop = lastNode.getBoundingClientRect().top - rect.top + 17;
          setLine({ top: fTop, len: Math.max(lTop - fTop, 0) });
        }

        let current = 0;
        const center = window.innerHeight / 2;
        phaseRefs.current.forEach((node, i) => {
          if (!node) return;
          const r = node.getBoundingClientRect();
          if (r.top <= center && r.bottom >= center) current = i;
        });
        setActive((prev) => (prev === current ? prev : current));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const lineTrack = inverse ? "bg-paper/12" : "bg-line";
  const title = inverse ? "text-paper" : "text-ink";
  const body = inverse ? "text-paper/70" : "text-ink/70";
  const dimTitle = inverse ? "text-paper/50" : "text-ink/45";
  const dimBody = inverse ? "text-paper/40" : "text-ink/45";
  const ringActive = inverse ? "border-signal bg-ink" : "border-signal bg-paper";

  return (
    <div ref={trackRef} className="relative">
      {/* hairline track + scroll-driven fill */}
      <div
        className={`absolute left-[13px] w-px ${lineTrack}`}
        style={{ top: line.top, height: line.len }}
        aria-hidden="true"
      >
        <div
          className="w-px bg-signal"
          style={{ height: `${Math.min(progress, 1) * 100}%` }}
        />
      </div>

      <div className="space-y-16 sm:space-y-20">
        {journeyPhases.map((phase, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <div
              key={phase.id}
              ref={(node) => {
                phaseRefs.current[i] = node;
              }}
              className="relative grid gap-4 pl-12 sm:pl-16"
            >
              {/* node */}
              <div
                className={`absolute left-0 top-1 grid h-[26px] w-[26px] place-items-center rounded-full border transition-all duration-500 ${
                  isActive ? ringActive : inverse ? "border-paper/30 bg-ink" : "border-ink/25 bg-paper"
                } ${isActive ? "shadow-[0_0_0_4px_rgba(201,79,61,0.18)]" : ""}`}
                aria-hidden="true"
              >
                <span
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    isActive || isPast ? "bg-signal" : inverse ? "bg-paper/35" : "bg-ink/30"
                  } ${isActive ? "scale-125" : ""}`}
                />
              </div>

              <div
                className={`transition-all duration-700 ease-out ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : isPast
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-25"
                }`}
              >
                <p className={`font-mono text-xs tracking-[0.18em] text-signal transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-70"}`}>
                  Phase {phase.id}
                </p>
                <h3
                  className={`mt-1.5 font-display text-2xl font-medium transition-colors duration-500 sm:text-3xl ${
                    isActive ? title : dimTitle
                  }`}
                >
                  {phase.name}
                </h3>
                <p className={`mt-3 max-w-md text-sm leading-relaxed transition-colors duration-500 ${isActive ? body : dimBody}`}>
                  {phase.focus}
                </p>
                <ul
                  className={`mt-4 flex flex-wrap gap-2 transition-opacity duration-500 ${
                    isActive || isPast ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {phase.actions.map((a) => (
                    <li
                      key={a}
                      className={`rounded-sm px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ${
                        isActive
                          ? inverse
                            ? "bg-paper/[0.08] text-paper/80 ring-1 ring-paper/15"
                            : "bg-paper-deep text-ink/70"
                          : inverse
                            ? "bg-paper/[0.05] text-paper/45"
                            : "bg-paper-deep/60 text-ink/45"
                      }`}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* bottom progress readout */}
      <div className="mt-12 flex items-center justify-between border-t border-line/60 pt-5">
        <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${inverse ? "text-paper/45" : "text-ink/45"}`}>
          {journeyPhases[active]?.name ?? "Discovery"}
        </span>
        <span className={`font-mono text-xs tabular-nums ${inverse ? "text-paper/45" : "text-ink/45"}`}>
          {Math.round(progress * 100)}% through your journey
        </span>
      </div>
    </div>
  );
}
