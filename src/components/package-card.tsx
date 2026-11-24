import Link from "next/link";
import { TravelPackage } from "@/lib/data";
import { formatPackagePrice } from "@/lib/utils";
import { Artwork } from "./artwork";
import { OverrideText } from "./override-text";

export function PackageCard({ pkg }: { pkg: TravelPackage }) {
  const formattedPrice = formatPackagePrice(pkg.price, pkg.currency);
  const symbolPrefix = formattedPrice.slice(0, formattedPrice.length - pkg.price.length);

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-panel transition-transform hover:-translate-y-0.5"
    >
      <div className="aspect-[16/10] w-full">
        <Artwork slug={pkg.slug} kind="card" label={pkg.specialty} photo={pkg.photo} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
            {pkg.specialty}
          </p>
        </div>
        <h3 className="mt-3 font-display text-xl font-medium text-ink">
          <OverrideText kind="packages" slug={pkg.slug} field="name">
            {pkg.name}
          </OverrideText>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
          <OverrideText kind="packages" slug={pkg.slug} field="summary">
            {pkg.summary}
          </OverrideText>
        </p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/45">from</p>
            <p className="font-display text-2xl font-medium text-ink">
              {symbolPrefix}
              <OverrideText kind="packages" slug={pkg.slug} field="price">
                {pkg.price}
              </OverrideText>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
