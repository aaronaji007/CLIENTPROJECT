import { notFound } from "next/navigation";
import Link from "next/link";
import { packages } from "@/lib/data";
import { ArrowIcon } from "@/components/icons";
import { Artwork } from "@/components/artwork";

export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = packages.find((x) => x.slug === slug);
  if (!p) return { title: "Package not found" };
  return { title: p.name, description: p.summary };
}

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <Link
        href="/packages"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
      >
        <ArrowIcon direction="left" /> All packages
      </Link>

      <div className="mt-8 overflow-hidden rounded-lg border border-line shadow-panel">
        <div className="aspect-[21/7] w-full">
          <Artwork slug={pkg.slug} kind="hero" label={`${pkg.city}, ${pkg.country}`} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
            {pkg.specialty} · {pkg.country}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
            {pkg.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">{pkg.summary}</p>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-medium text-ink">What&apos;s coordinated</h2>
            <ul className="mt-4 space-y-3">
              {pkg.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-sm bg-signal/5 px-5 py-4 ring-1 ring-signal/20">
            <p className="text-sm font-medium text-signal-deep">Placeholder pricing</p>
            <p className="mt-1 text-sm text-ink/65">{pkg.notes}</p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-line bg-ink text-paper">
            <div className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                Package
              </p>
              <p className="mt-2 font-display text-3xl font-medium text-paper">
                {pkg.currency === "USD" ? "$" : ""}
                {pkg.price}
              </p>
              <p className="mt-1 text-xs text-paper/55">placeholder · {pkg.days} days coordinated</p>
              <div className="mt-5 space-y-3 border-t border-paper/15 pt-5 text-sm text-paper/80">
                <p className="flex justify-between">
                  <span className="text-paper/55">Destination</span>
                  <span>{pkg.city}, {pkg.country}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-paper/55">Specialty</span>
                  <span>{pkg.specialty}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-paper/55">Length</span>
                  <span>{pkg.days} days</span>
                </p>
              </div>
            </div>
            <Link
              href="/#journey"
              className="block w-full bg-signal px-6 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-deep"
            >
              Plan this journey
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
