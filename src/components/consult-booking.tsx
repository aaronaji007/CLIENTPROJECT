"use client";

import { useEffect, useMemo, useState } from "react";

type Slot = { utc: string; label: string };

export function ConsultBooking() {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [tz, setTz] = useState<string>("");

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
      } catch {
        setTz("UTC");
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const slots = useMemo<Slot[]>(() => {
    const base = [
      { day: 1, hour: 9 },
      { day: 1, hour: 15 },
      { day: 2, hour: 10 },
      { day: 3, hour: 14 },
      { day: 4, hour: 8 },
      { day: 5, hour: 16 },
    ];
    return base.map((s) => {
      const d = new Date(Date.UTC(2026, 8, 9 + s.day, s.hour, 0, 0));
      const label = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: tz || undefined,
      }).format(d);
      return { utc: d.toISOString(), label };
    });
  }, [tz]);

  const pick = slots.find((s) => s.utc === selected);

  return (
    <div className="rounded-lg border border-line bg-paper p-6 shadow-panel">
      <h3 className="font-display text-2xl font-medium text-ink">Gather with a case manager</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
        Choose a time shown in your local timezone
        {tz && (
          <span className="ml-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-ink/55">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            {tz}
          </span>
        )}
        .
      </p>

      {!confirmed ? (
        <>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {slots.map((slot) => (
              <button
                key={slot.utc}
                type="button"
                onClick={() => setSelected(slot.utc)}
                aria-pressed={selected === slot.utc}
                className={`rounded-sm border px-3 py-2.5 text-left text-sm transition-colors ${
                  selected === slot.utc
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink hover:border-ink"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink/55">
              A 20-minute consult. Nothing is charged and nothing is decided here.
            </p>
            <button
              type="button"
              disabled={!selected}
              onClick={() => setConfirmed(true)}
              className="rounded-sm bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm this time
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-sm border border-line bg-paper p-5">
          <p className="font-display text-lg font-medium text-ink">Consultation requested</p>
          {pick && (
            <p className="mt-1 text-sm text-ink/70">
              {pick.label} in your timezone ({tz}).
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            We&apos;ll email a calendar invite with a secure call link and a short brief to
            prepare. Confirmation arrives in your local time — not ours.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmed(false);
              setSelected(null);
            }}
            className="mt-4 text-sm font-medium text-ink underline underline-offset-4 hover:text-signal"
          >
            Choose a different time
          </button>
        </div>
      )}
    </div>
  );
}
