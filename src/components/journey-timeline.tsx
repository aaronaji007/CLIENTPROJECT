import { journeyPhases } from "@/lib/data";

export function JourneyTimeline({ inverse = false }: { inverse?: boolean }) {
  const line = inverse ? "bg-paper/15" : "bg-line";
  const signal = "text-signal";
  const title = inverse ? "text-paper" : "text-ink";
  const body = inverse ? "text-paper/75" : "text-ink/70";
  const meta = inverse ? "text-paper/60" : "text-ink/55";
  const ring = inverse ? "border-paper/30 bg-paper/[0.06]" : "border-ink/30 bg-paper";
  const node = inverse ? "bg-signal" : "bg-ink";

  return (
    <div className="relative mx-auto max-w-3xl">
      <div
        className={`absolute left-[11px] top-2 bottom-2 w-px ${line} sm:left-1/2 sm:-translate-x-px`}
        aria-hidden="true"
      />
      <div className="space-y-10">
        {journeyPhases.map((phase) => (
          <div
            key={phase.id}
            className="relative grid gap-3 pl-10 sm:grid-cols-2 sm:gap-10 sm:pl-0"
          >
            <div
              className={`flex items-center gap-4 ${
                phase.id === "02" ? "sm:order-2 sm:text-left" : "sm:text-right sm:justify-end"
              }`}
            >
              <div className={phase.id === "02" ? "sm:order-1" : ""}>
                <p className={`font-mono text-xs tracking-[0.18em] ${signal}`}>{phase.id}</p>
                <h3 className={`mt-1 font-display text-2xl font-medium ${title}`}>{phase.name}</h3>
                <p className={`mt-2 max-w-sm text-sm leading-relaxed ${body}`}>{phase.focus}</p>
                <ul className={`mt-3 space-y-1 font-mono text-[11px] uppercase tracking-[0.1em] ${meta}`}>
                  {phase.actions.map((a) => (
                    <li key={a} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-signal" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="hidden sm:block" />
            <div
              className={`absolute left-0 top-1 grid h-[22px] w-[22px] place-items-center rounded-full border ${ring} sm:left-1/2 sm:-translate-x-1/2`}
              aria-hidden="true"
            >
              <span className={`h-2 w-2 rounded-full ${node}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
