"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal font-semibold">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
        We couldn&apos;t load this page
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink/70">
        An unexpected error occurred while loading your care information. You can try again or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm bg-signal px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-deep"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-sm border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-ink"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
