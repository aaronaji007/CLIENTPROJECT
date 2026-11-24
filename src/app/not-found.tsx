import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal font-semibold">
        404 — Not found
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink/70">
        The specialty, care package, or article you requested could not be found or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-soft"
        >
          Return home
        </Link>
        <Link
          href="/packages"
          className="rounded-sm border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-ink"
        >
          Browse packages
        </Link>
      </div>
    </div>
  );
}
