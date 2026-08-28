"use client";

import { useMemo, useState } from "react";
import type { Specialty, TravelPackage } from "@/lib/data";
import { SpecialtyCard } from "./specialty-card";
import { PackageCard } from "./package-card";

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="9" cy="9" r="5" />
      <path d="M13 13 L17 17" />
    </svg>
  );
}

export function SpecialtyCollection({ specialties }: { specialties: Specialty[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const categories = useMemo(
    () => [...new Set(specialties.map((s) => s.category))].sort(),
    [specialties],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return specialties.filter((s) => {
      const matchCat = cat === "all" || s.category === cat;
      const matchQ =
        !term ||
        [s.name, s.category, s.summary, s.tagline].some((t) => t.toLowerCase().includes(term));
      return matchCat && matchQ;
    });
  }, [specialties, q, cat]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-xs">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">
            <SearchIcon />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search specialties…"
            className="w-full rounded-sm border border-ink/20 bg-white/40 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-ink"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                cat === c
                  ? "bg-ink text-paper"
                  : "border border-ink/20 text-ink hover:border-ink"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-ink/55">
          No specialties match your search. Try a different term.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SpecialtyCard
              key={s.slug}
              slug={s.slug}
              category={s.category}
              name={s.name}
              summary={s.summary}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PackageCollection({
  packages,
  initialQuery,
}: {
  packages: TravelPackage[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery ?? "");
  const [spec, setSpec] = useState("all");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "days-asc">(
    "featured",
  );

  const specialties = useMemo(
    () => [...new Set(packages.map((p) => p.specialty))].sort(),
    [packages],
  );
  const countries = useMemo(
    () => [...new Set(packages.map((p) => p.country))].sort(),
    [packages],
  );
  const parsePrice = (p: TravelPackage) => Number(p.price.replace(/[^0-9]/g, "")) || 0;

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = packages.filter((p) => {
      const matchS = spec === "all" || p.specialty === spec;
      const matchC = country === "all" || p.country === country;
      const matchQ =
        !term ||
        [p.name, p.city, p.country, p.specialty, p.summary].some((t) =>
          t.toLowerCase().includes(term),
        );
      return matchS && matchC && matchQ;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => parsePrice(a) - parsePrice(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => parsePrice(b) - parsePrice(a));
    if (sort === "days-asc") list = [...list].sort((a, b) => a.days - b.days);
    return list;
  }, [packages, q, spec, country, sort]);

  const selectCls =
    "rounded-sm border border-ink/20 bg-white/40 px-3 py-2.5 text-sm text-ink focus:border-ink";
  const labelCls = "font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50";

  return (
    <div>
      <div className="grid gap-4 border-b border-line pb-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <label className="relative block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">
            <SearchIcon />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search packages…"
            className="w-full rounded-sm border border-ink/20 bg-white/40 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-ink"
          />
        </label>

        <label className="block">
          <span className={labelCls}>Specialty</span>
          <select
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            className={`mt-1 w-full ${selectCls}`}
          >
            <option value="all">All specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelCls}>Destination</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`mt-1 w-full ${selectCls}`}
          >
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelCls}>Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className={`mt-1 w-full ${selectCls}`}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
            <option value="days-asc">Shortest stay</option>
          </select>
        </label>
      </div>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
        {filtered.length} {filtered.length === 1 ? "package" : "packages"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/55">
          No packages match your filters. Try broadening the search.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PackageCard key={p.slug} pkg={p} />
          ))}
        </div>
      )}
    </div>
  );
}
