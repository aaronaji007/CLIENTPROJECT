"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("carte-clinique-cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    localStorage.setItem("carte-clinique-cookie-consent", "true");
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-paper/95 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:rounded-lg sm:border sm:p-5">
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-display text-lg font-medium text-ink">Cookie Consent</p>
          <p className="mt-1 text-xs leading-relaxed text-ink/70">
            We use cookies to improve your experience and measure site performance. No personal medical data is tracked.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
          >
            Accept
          </button>
          <button
            onClick={() => setShow(false)}
            className="flex-1 rounded-sm border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
