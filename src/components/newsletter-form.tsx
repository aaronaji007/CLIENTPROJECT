"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    if (typeof window !== "undefined") {
      const existing = JSON.parse(
        localStorage.getItem("carte-clinique-subscribers") || "[]",
      ) as string[];
      if (!existing.includes(email.trim().toLowerCase())) {
        existing.push(email.trim().toLowerCase());
        localStorage.setItem("carte-clinique-subscribers", JSON.stringify(existing));
      }
    }
    setStatus("done");
    setEmail("");
  };

  if (status === "done") {
    return (
      <p className="max-w-sm rounded-sm bg-paper/[0.08] px-4 py-3 text-sm text-paper/85 ring-1 ring-paper/15">
        Thank you — you&rsquo;re on the list. A confirmation would follow in production.
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} noValidate className="flex max-w-sm gap-2">
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
        className="w-full min-w-0 rounded-sm border border-paper/20 bg-paper/[0.06] px-3 py-2.5 text-sm text-paper placeholder:text-paper/40 focus:border-paper focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-sm bg-signal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-signal-deep"
      >
        Subscribe
      </button>
    </form>
  );
}
