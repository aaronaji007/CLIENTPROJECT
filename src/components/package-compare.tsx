"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import type { TravelPackage } from "@/lib/data";
import { Artwork } from "./artwork";

const MAX = 3;

function parsePrice(p: TravelPackage) {
  return Number(p.price.replace(/[^0-9]/g, "")) || 0;
}

export function PackageCompare({ packages }: { packages: TravelPackage[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => {
    const list = packages.filter((p) => selected.includes(p.slug));
    return list;
  }, [packages, selected]);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX) return prev;
      return [...prev, slug];
    });
  };

  const addCls = (active: boolean) =>
    `rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
      active ? "bg-ink text-paper" : "border border-ink/20 text-ink hover:border-ink"
    }`;

  return (
    <div id="compare">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Compare packages side by side
          </h2>
          <p className="mt-3 text-ink/70">
            Select up to {MAX} to weigh price, length, and what is coordinated at a glance.
          </p>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
          {rows.length}/{MAX} selected
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {packages.map((p) => {
          const active = selected.includes(p.slug);
          const disabled = !active && selected.length >= MAX;
          return (
            <button
              key={p.slug}
              onClick={() => toggle(p.slug)}
              disabled={disabled}
              aria-pressed={active}
              className={`${addCls(active)} ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-ink/20 bg-paper/40 p-10 text-center">
          <p className="text-sm text-ink/55">
            Select two or three packages above to compare them here.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-line shadow-panel">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-40 bg-paper-deep/60 p-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  Package
                </th>
                {rows.map((r) => (
                  <th key={r.slug} className="bg-paper p-4">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm">
                      <Artwork slug={r.slug} kind="card" label={r.city} />
                    </div>
                    <Link
                      href={`/packages/${r.slug}`}
                      className="mt-3 block font-display text-lg font-medium text-ink hover:underline"
                    >
                      {r.name}
                    </Link>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/50">
                      {r.specialty}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Price" values={rows.map((r) => `$${r.price}`)} bold />
              <CompareRow
                label="Length"
                values={rows.map((r) => `${r.days} days`)}
              />
              <CompareRow
                label="Destination"
                values={rows.map((r) => `${r.city}, ${r.country}`)}
              />
              <CompareRow
                label="Included"
                values={rows.map((r) => (
                  <ul key={r.slug} className="space-y-1.5">
                    {r.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-ink/75">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              />
              <CompareRow
                label="Action"
                values={rows.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/packages/${r.slug}`}
                    className="inline-flex rounded-sm bg-ink px-4 py-2 text-xs font-semibold text-paper shadow-panel transition-colors hover:bg-ink-soft"
                  >
                    View package
                  </Link>
                ))}
              />
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-ink/45">
        Prices are placeholders. {rows.length > 0 ? `From $${Math.min(...rows.map(parsePrice)).toLocaleString()} to $${Math.max(...rows.map(parsePrice)).toLocaleString()}.` : ""}
      </p>
    </div>
  );
}

function CompareRow({
  label,
  values,
  bold,
}: {
  label: string;
  values: ReactNode[];
  bold?: boolean;
}) {
  return (
    <tr className="border-t border-line">
      <td className="bg-paper-deep/40 p-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`bg-paper p-4 align-top ${
            bold ? "font-display text-xl font-medium text-ink" : ""
          }`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
