"use client";

import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";
import { useContentOverrides } from "@/lib/override-context";

export function Footer() {
  const ov = useContentOverrides();
  const site = ov.site?.global || {};

  return (
    <footer className="bg-[#18231c] dark:bg-[#101412] text-[#f4efe2] border-t border-line">
      <div className="border-b border-[#f4efe2]/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl font-medium text-[#f4efe2]">Stay in the loop</p>
            <p className="mt-2 text-sm leading-relaxed text-[#f4efe2]/75">
              Occasional notes on planning care abroad — never spam, always in your timezone.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <div className="inline-block rounded-xl bg-white/95 dark:bg-[#1a201c] px-3 py-2 shadow-sm border border-[#f4efe2]/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/medycare-logo.png"
                alt={site.brandName || "MedyCare 2₹ism"}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal font-semibold">
              {site.brandTagline || "MedicalCare Beyond Borders"}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-[#f4efe2]/80">
              {site.footerDisclaimer ||
                "A premier global healthcare & medical tourism concierge. Coordinating every step of your medical journey from discovery to recovery across borders."}
            </p>
            <div className="pt-2 font-mono text-xs text-[#f4efe2]/75 space-y-1.5">
              <p>
                <span className="text-[#f4efe2]/55">Australia — Sydney:</span>{" "}
                <a href="tel:+61466588037" className="hover:text-[#f4efe2] underline-offset-4 hover:underline">
                  +61 466588037
                </a>
              </p>
              <p>
                <span className="text-[#f4efe2]/55">India — Thrissur, Kerala:</span>{" "}
                <a href="tel:+917293119311" className="hover:text-[#f4efe2] underline-offset-4 hover:underline">
                  +91 72931 19311
                </a>
              </p>
              {site.email && <p>📧 {site.email}</p>}
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#f4efe2]/65">
              Explore
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[#f4efe2]/80">
              <li><Link href="/specialties" className="hover:text-[#f4efe2]">Specialties &amp; Surgeries</Link></li>
              <li><Link href="/packages" className="hover:text-[#f4efe2]">Care Packages</Link></li>
              <li><Link href="/faq" className="hover:text-[#f4efe2]">FAQ</Link></li>
              <li><Link href="/blog" className="hover:text-[#f4efe2]">Journal</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#f4efe2]/65">
              Care &amp; Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[#f4efe2]/80">
              <li><Link href="/contact" className="hover:text-[#f4efe2]">Contact Us</Link></li>
              <li><Link href="/consult" className="hover:text-[#f4efe2]">Book a consult</Link></li>
              <li><Link href="/#journey" className="hover:text-[#f4efe2]">The journey</Link></li>
              <li><Link href="/admin" className="hover:text-[#f4efe2]">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#f4efe2]/15 pt-6 text-xs text-[#f4efe2]/60 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} {site.brandName || "MedyCare 2₹ism"} · {site.brandTagline || "MedicalCare Beyond Borders"}. All rights reserved.</p>
          <p className="font-mono">Australia (Sydney) · India (Thrissur, Kerala)</p>
        </div>
      </div>
    </footer>
  );
}
