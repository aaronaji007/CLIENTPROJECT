"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "./site-provider";

const steps = ["Your care", "Documents", "Contact & timing", "Review"];

export function InquiryModal() {
  const { inquiry, closeInquiry } = useSite();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    condition: "",
    procedure: "",
    timeline: "flexible",
    name: "",
    email: "",
    country: "",
    notes: "",
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (inquiry.open) {
      topRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [inquiry.open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && inquiry.open) closeInquiry();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inquiry.open, closeInquiry]);

  if (!inquiry.open) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    if (typeof window !== "undefined") {
      const record = {
        id: `inq-${Date.now()}`,
        at: new Date().toISOString(),
        condition: form.condition,
        procedure: form.procedure || "",
        timeline: form.timeline,
        name: form.name,
        email: form.email,
        country: form.country,
        notes: form.notes,
        files: files.map((f) => f.name),
        status: "new",
      };
      const existing = JSON.parse(localStorage.getItem("carte-clinique-inquiries") || "[]");
      existing.unshift(record);
      localStorage.setItem("carte-clinique-inquiries", JSON.stringify(existing));
    }
    setStep(0);
    setForm({
      condition: "",
      procedure: "",
      timeline: "flexible",
      name: "",
      email: "",
      country: "",
      notes: "",
    });
    setFiles([]);
    closeInquiry();
  };

  const canContinue = () => {
    if (step === 0) return form.condition.trim().length > 0;
    if (step === 2) return form.name.trim().length > 0 && /\S+@\S+\.\S+/.test(form.email);
    return true;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Start your inquiry"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeInquiry();
      }}
    >
      <div
        ref={dialogRef}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col bg-paper text-ink shadow-panel sm:rounded-lg"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">
              Step {step + 1} of {steps.length}
            </p>
            <h2 className="mt-1 font-display text-2xl font-medium">Start your inquiry</h2>
          </div>
          <button
            ref={topRef}
            type="button"
            onClick={closeInquiry}
            aria-label="Close inquiry"
            className="grid h-9 w-9 place-items-center rounded-sm border border-ink/20 text-ink hover:bg-paper-deep"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M5 5 L15 15 M15 5 L5 15" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-5" aria-hidden="true">
          {steps.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= step ? "bg-ink" : "bg-ink/10"
                }`}
              />
              <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-wide text-ink/50">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 0 && (
            <div className="space-y-5">
              <WarningBanner />
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-ink">
                  What are you seeking care for?
                </label>
                <input
                  id="condition"
                  value={form.condition}
                  onChange={set("condition")}
                  placeholder="e.g. total knee replacement"
                  className="mt-2 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2.5 text-ink placeholder:text-ink/40 focus:border-ink"
                />
              </div>
              <div>
                <label htmlFor="procedure" className="block text-sm font-medium text-ink">
                  Preferred procedure or specialty (optional)
                </label>
                <select
                  id="procedure"
                  value={form.procedure}
                  onChange={set("procedure")}
                  className="mt-2 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2.5 text-ink focus:border-ink"
                >
                  <option value="">Not sure yet</option>
                  <option>Orthopedics</option>
                  <option>Cardiology</option>
                  <option>Aesthetic & Reconstructive</option>
                  <option>Fertility</option>
                  <option>Neurosurgery</option>
                  <option>Oncology</option>
                  <option>Dental & Maxillofacial</option>
                  <option>Ophthalmology</option>
                </select>
              </div>
              <div>
                <span className="block text-sm font-medium text-ink">Preferred timing</span>
                <div className="mt-2 flex gap-3">
                  {[
                    ["flexible", "Flexible"],
                    ["next-3-months", "Next 3 months"],
                    ["urgent", "Within 6 weeks"],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, timeline: val }))}
                      aria-pressed={form.timeline === val}
                      className={`rounded-sm border px-3 py-2 text-sm transition-colors ${
                        form.timeline === val
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/20 text-ink hover:border-ink"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <WarningBanner small />
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink/25 bg-white/30 px-6 py-10 text-center hover:border-ink/50"
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-ink/50" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16 V5 M8 9 L12 5 L16 9 M5 19 H19" />
                </svg>
                <span className="text-sm font-medium text-ink">Upload medical documents</span>
                <span className="text-xs text-ink/55">
                  Imaging, reports, or letters — encrypted in transit. Optional.
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.dcm"
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
              />
              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file, i) => (
                    <li
                      key={`${file.name}-${i}`}
                      className="flex items-center justify-between rounded-sm border border-line bg-white/40 px-3 py-2 text-sm"
                    >
                      <span className="truncate text-ink">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label={`Remove ${file.name}`}
                        className="text-ink/50 hover:text-signal"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-ink/55">
                You can share documents now or later. Your case manager will confirm a private,
                secure upload method before you send anything.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ink">Full name</label>
                  <input id="name" value={form.name} onChange={set("name")} className="mt-2 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2.5 text-ink placeholder:text-ink/40 focus:border-ink" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-ink">Home country</label>
                  <input id="country" value={form.country} onChange={set("country")} className="mt-2 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2.5 text-ink placeholder:text-ink/40 focus:border-ink" placeholder="Country" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
                <input id="email" type="email" value={form.email} onChange={set("email")} className="mt-2 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2.5 text-ink placeholder:text-ink/40 focus:border-ink" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-ink">Anything else we should know (optional)</label>
                <textarea id="notes" value={form.notes} onChange={set("notes")} rows={3} className="mt-2 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2.5 text-ink placeholder:text-ink/40 focus:border-ink" />
              </div>
              <p className="text-xs text-ink/55">
                A case manager replies in your local time. {form.country ? `We schedule around ${form.country || "your"} timezone.` : ""}
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-lg border border-line bg-white/40 p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Review</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <ReviewRow label="Condition" value={form.condition} />
                  <ReviewRow label="Procedure" value={form.procedure || "To be advised"} />
                  <ReviewRow label="Timing" value={form.timeline === "flexible" ? "Flexible" : form.timeline === "next-3-months" ? "Next 3 months" : "Within 6 weeks"} />
                  <ReviewRow label="Name" value={form.name} />
                  <ReviewRow label="Email" value={form.email} />
                  <ReviewRow label="Documents" value={files.length ? `${files.length} file(s) ready to share` : "None (optional)"} />
                </dl>
              </div>
              <p className="text-xs text-ink/55">
                Submitting sends a non-binding inquiry. No medical advice is provided and no
                decision is made here — a case manager follows up to plan next steps.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
          {step > 0 ? (
            <button type="button" onClick={back} className="rounded-sm border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:border-ink">
              Back
            </button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canContinue()}
              className="rounded-sm bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="rounded-sm bg-signal px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-deep"
            >
              Submit inquiry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function InquiryModalRoot() {
  const { inquiry } = useSite();
  return <InquiryModal key={"modal" + inquiry.session} />;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/55">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function WarningBanner({ small }: { small?: boolean }) {
  return (
    <div className="rounded-sm bg-signal/5 px-4 py-3 ring-1 ring-signal/20">
      <p className={`font-medium text-signal-deep ${small ? "text-xs" : "text-sm"}`}>
        When you communicate with us, you share unverified medical information.
      </p>
      <p className={`mt-1 text-ink/60 ${small ? "text-[11px]" : "text-xs"}`}>
        We never provide medical diagnosis or advice, and no claim on this site is a
        verified clinical promise. Your own doctors remain in charge of your decisions.
      </p>
    </div>
  );
}
