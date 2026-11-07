"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSite } from "./site-provider";
import { ThemeToggle } from "./theme-toggle";
import { SiteSearch } from "./site-search";

const nav = [
  { href: "/specialties", label: "Specialties" },
  { href: "/packages", label: "Packages" },
  { href: "/#journey", label: "The journey" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Journal" },
];

export function Emblem({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/medycare-logo.png"
      alt="MedyCare 2₹ism emblem"
      className={`h-9 w-auto object-contain ${className}`}
    />
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openInquiry } = useSite();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex flex-col items-start gap-1 py-1 group" onClick={() => setMenuOpen(false)}>
            <img
              src="/images/medycare-logo.png"
              alt="MedyCare 2₹ism"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
            <span className="font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.18em] text-signal font-semibold leading-none">
              MedicalCare Beyond Borders
            </span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-ink ${
                  item.href !== "/#journey" && pathname.startsWith(item.href)
                    ? "text-ink"
                    : "text-ink/75"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <SiteSearch />
            <ThemeToggle />
            <Link
              href="/admin"
              className="hidden items-center gap-2 rounded-sm border border-ink/20 px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink md:inline-flex"
            >
              <LockIcon />
              Admin
            </Link>
            <button
              type="button"
              onClick={() => openInquiry()}
              className="hidden rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-panel transition-colors hover:bg-ink-soft sm:inline-flex"
            >
              Plan your care
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-sm border border-ink/20 text-ink xl:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                {menuOpen ? (
                  <path d="M5 5 L15 15 M15 5 L5 15" />
                ) : (
                  <path d="M3 6 H17 M3 10 H17 M3 14 H17" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            className="border-t border-line bg-paper px-5 py-3 xl:hidden"
            aria-label="Primary mobile"
          >
            <div className="flex flex-col">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-line/60 py-3 text-base font-medium text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 border-b border-line/60 py-3 text-base font-medium text-ink"
              >
                <LockIcon /> Admin
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openInquiry();
                }}
                className="mt-3 rounded-sm bg-ink px-4 py-3 text-base font-semibold text-paper hover:bg-ink-soft"
              >
                Plan your care
              </button>
            </div>
          </nav>
        )}
      </header>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="7" width="9" height="6" rx="1" />
      <path d="M5.5 7 V5 a2.5 2.5 0 0 1 5 0 v2" />
    </svg>
  );
}
