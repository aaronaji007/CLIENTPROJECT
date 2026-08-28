import Link from "next/link";
import { TravelPackage } from "@/lib/data";
import { Artwork } from "./artwork";

export function PackageCard({ pkg }: { pkg: TravelPackage }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-panel transition-transform hover:-translate-y-0.5"
    >
      <div className="aspect-[16/10] w-full">
        <Artwork slug={pkg.slug} kind="card" label={`${pkg.city} · ${pkg.country}`} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
            {pkg.specialty}
          </p>
          <p className="font-mono text-xs text-ink/55">{pkg.days} days</p>
        </div>
        <h3 className="mt-3 font-display text-xl font-medium text-ink">{pkg.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">{pkg.summary}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/45">from</p>
            <p className="font-display text-2xl font-medium text-ink">
              {pkg.currency === "USD" ? "$" : ""}
              {pkg.price}
            </p>
          </div>
          <span className="rounded-sm bg-paper-deep px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-ink/65">
            {pkg.country}
          </span>
        </div>
      </div>
    </Link>
  );
}
