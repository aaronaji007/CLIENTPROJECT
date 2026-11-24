"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const { createSubscriberDb } = await import("@/app/admin/actions");
      const res = await createSubscriberDb(email.trim().toLowerCase());
      if (res.ok) {
        setStatus("done");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="max-w-sm rounded-sm bg-[#f4efe2]/10 px-4 py-3 text-sm text-[#f4efe2]/90 ring-1 ring-[#f4efe2]/20">
        Thank you — you&rsquo;re subscribed for care-planning updates.
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} noValidate className="flex max-w-sm flex-col gap-2">
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@example.com"
          className="w-full min-w-0 rounded-sm border border-[#f4efe2]/25 bg-[#f4efe2]/10 px-3 py-2.5 text-sm text-[#f4efe2] placeholder:text-[#f4efe2]/45 focus:border-[#f4efe2] focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-sm bg-signal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-signal-deep disabled:opacity-50"
        >
          {status === "submitting" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-signal">Please enter a valid email address or try again shortly.</p>
      )}
    </form>
  );
}
