"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    specialty: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !/\S+@\S+\.\S+/.test(form.email.trim()) || !form.message.trim()) {
      setError("Please fill in your name, a valid email address, and your message.");
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
          if (parts.length) utmSuffix = `\n[Attribution: ${parts.join(" / ")}]`;
        }
      } catch {
        /* ignore */
      }

      const phoneLine = form.phone.trim() ? `Phone / Mobile: ${form.phone.trim()}\n` : "";
      const { createInquiryDb } = await import("@/app/admin/actions");
      await createInquiryDb({
        condition: form.specialty ? `Contact Inquiry — ${form.specialty}` : "General Contact Inquiry",
        procedure: form.specialty || null,
        timeline: "flexible",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        country: form.country.trim() || null,
        notes: `${phoneLine}${form.message.trim()}${utmSuffix}`,
        files: [],
      });

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send your message right now. Please call or WhatsApp our regional offices directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-8 text-center shadow-panel">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-signal/15 text-signal">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-2xl font-medium text-ink">Message received</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          Thank you, {form.name}. A regional coordinator will get back to you at {form.email} in your local timezone.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", country: "", specialty: "", message: "" });
          }}
          className="mt-6 rounded-sm border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-paper p-6 shadow-panel sm:p-8 space-y-5"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal font-semibold">
          Direct message
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium text-ink sm:text-3xl">
          Send a message to our team
        </h2>
        <p className="mt-2 text-sm text-ink/65">
          Share your question or care requirements and a dedicated coordinator in Australia or India will respond promptly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium text-ink">Full name *</span>
          <input
            required
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Your full name"
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 dark:bg-paper-deep/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-ink">Email address *</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 dark:bg-paper-deep/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium text-ink">Mobile / WhatsApp (optional)</span>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="e.g. +61 400 000 000"
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 dark:bg-paper-deep/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-ink">Country / City (optional)</span>
          <input
            type="text"
            value={form.country}
            onChange={set("country")}
            placeholder="e.g. Sydney, Australia"
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 dark:bg-paper-deep/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-sm font-medium text-ink">Specialty of interest (optional)</span>
        <select
          value={form.specialty}
          onChange={set("specialty")}
          className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 dark:bg-paper-deep/60 px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
        >
          <option value="">General inquiry / Not sure yet</option>
          <option value="Orthopedic & Joint Surgery">Orthopedic &amp; Joint Surgery</option>
          <option value="Aesthetic & Plastic Surgery">Aesthetic &amp; Plastic Surgery</option>
          <option value="Fertility & Reproductive Medicine">Fertility &amp; Reproductive Medicine</option>
          <option value="Urology & Men's Health">Urology &amp; Men&apos;s Health</option>
          <option value="Oncology & Precision Treatment">Oncology &amp; Precision Treatment</option>
          <option value="Dental & Maxillofacial Care">Dental &amp; Maxillofacial Care</option>
          <option value="Ophthalmology & Vision">Ophthalmology &amp; Vision</option>
        </select>
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-ink">How can we help? *</span>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us about the treatment or assistance you are looking for…"
          className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 dark:bg-paper-deep/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
        />
      </label>

      {error && (
        <p className="rounded-sm border border-signal/30 bg-signal/10 px-3.5 py-2.5 text-xs text-signal">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink/55">
          Confidential &amp; obligation-free. We respond in your local timezone.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-sm bg-signal px-6 py-3 text-sm font-semibold text-white shadow-panel transition-colors hover:bg-signal-deep disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
