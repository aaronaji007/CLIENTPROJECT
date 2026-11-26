"use client";

import { useEffect, useMemo, useState } from "react";

type Slot = { utc: string; label: string };

const SLOT_OFFSETS = [
  { dayOffset: 1, hour: 9 },
  { dayOffset: 1, hour: 15 },
  { dayOffset: 2, hour: 10 },
  { dayOffset: 3, hour: 14 },
  { dayOffset: 4, hour: 8 },
  { dayOffset: 5, hour: 16 },
];

export function ConsultBooking() {
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tz, setTz] = useState<string>("");
  const [anchorMs, setAnchorMs] = useState<number | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
      } catch {
        setTz("UTC");
      }
      const now = new Date();
      setAnchorMs(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const slots = useMemo<Slot[]>(() => {
    if (anchorMs === null) return [];
    const base = new Date(anchorMs);
    return SLOT_OFFSETS.map((s) => {
      const d = new Date(
        Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + s.dayOffset, s.hour, 0, 0),
      );
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
  }, [tz, anchorMs]);

  const pick = slots.find((s) => s.utc === selected);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pick) {
      setError("Please select a preferred time slot.");
      return;
    }
    if (!name.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError("Please enter your name and a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      let utmSuffix = "";
      try {
        const raw = sessionStorage.getItem("carte-clinique-utm");
        if (raw) {
          const u = JSON.parse(raw) as { source?: string; medium?: string; campaign?: string };
          const parts = [u.source, u.medium, u.campaign].filter(Boolean);
          if (parts.length) utmSuffix = ` | UTM: ${parts.join(" / ")}`;
        }
      } catch {
        /* ignore */
      }

      const { createInquiryDb } = await import("@/app/admin/actions");
      await createInquiryDb({
        condition: "Case Manager Consultation",
        procedure: "Initial Telemedicine Consult",
        timeline: "flexible",
        name: name.trim(),
        email: email.trim().toLowerCase(),
        notes: `Requested slot: ${pick.label} (${tz || "UTC"} / ${pick.utc})${utmSuffix}`,
        files: [],
      });
      setConfirmed(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not book consultation right now. Please try again shortly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-line bg-paper dark:bg-[#1a201c] p-6 shadow-panel">
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
        <form onSubmit={handleConfirm}>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {slots.length === 0 ? (
              <p className="col-span-2 py-4 text-xs text-ink/50">Loading local slots…</p>
            ) : (
              slots.map((slot) => (
                <button
                  key={slot.utc}
                  type="button"
                  onClick={() => setSelected(slot.utc)}
                  aria-pressed={selected === slot.utc}
                  className={`rounded-sm border px-3 py-2.5 text-left text-sm transition-colors ${
                    selected === slot.utc
                      ? "border-signal bg-signal text-white font-medium"
                      : "border-line bg-white/40 dark:bg-paper-deep/60 text-ink hover:border-ink"
                  }`}
                >
                  {slot.label}
                </button>
              ))
            )}
          </div>

          {selected && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                aria-label="Your name"
                className="rounded-sm border border-line bg-white/60 dark:bg-paper-deep/60 px-3 py-2 text-sm text-ink placeholder:text-ink/45"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com *"
                aria-label="Email address"
                className="rounded-sm border border-line bg-white/60 dark:bg-paper-deep/60 px-3 py-2 text-sm text-ink placeholder:text-ink/45"
              />
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-sm border border-signal/30 bg-signal/10 px-3 py-2 text-xs text-signal">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink/55">
              A confidential introductory consult. Nothing is charged and nothing is decided here.
            </p>
            <button
              type="submit"
              disabled={!selected || submitting}
              className="rounded-sm bg-signal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-signal-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Sending…" : "Confirm this time"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-sm border border-line bg-paper-deep/50 p-5">
          <p className="font-display text-lg font-medium text-ink">Consultation requested</p>
          {pick && (
            <p className="mt-1 text-sm text-ink/70">
              {pick.label} in your timezone ({tz}).
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            We&apos;ve logged your request for {email} and will follow up with your calendar invite
            in your local time — not ours.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmed(false);
              setSelected(null);
              setError(null);
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
