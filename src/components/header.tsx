"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSite } from "./site-provider";

const nav = [
  { href: "/specialties", label: "Specialties" },
  { href: "/packages", label: "Packages" },
  { href: "/#journey", label: "The journey" },
  { href: "/blog", label: "Journal" },
];

export function Emblem() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-9 w-9 text-ink"
      role="img"
      aria-label="Carte Clinique emblem"
    >
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <path
        d="M20 8.5 C27 12 31 16 31 22 C31 26.5 27 30 20 31.5 C13 30 9 26.5 9 22 C9 16 13 12 20 8.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M12.5 22 H27.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path
        d="M20 13.5 C22.2 16.5 23 19.5 23 22 C23 24.5 22.2 27.5 20 30.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <circle cx="20" cy="22" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openInquiry } = useSite();
  const pathname = usePathname();

  return (
    <>
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-5 py-2 text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
          <p className="text-xs text-paper/80">
            Coordinating care abroad since 2026 · Concept demonstration site — all data is
            placeholder
          </p>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-signal sm:block" aria-hidden="true" />
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/20">
              <Emblem />
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-medium tracking-tight text-ink">
                Carte Clinique
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55">
                Global Care Concierge
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-ink ${
                  item.href !== "/#journey" && pathname.startsWith(item.href)
                    ? "text-ink"
                    : "text-ink/65"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
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
              className="hidden rounded-sm bg-signal px-4 py-2 text-sm font-semibold text-white shadow-panel transition-colors hover:bg-signal-deep sm:inline-flex"
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
                className="mt-3 rounded-sm bg-signal px-4 py-3 text-base font-semibold text-white"
              >
                Plan your care
              </button>
            </div>
          </nav>
        )}
      </header>
    </>
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
