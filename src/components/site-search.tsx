"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { searchDb, type SearchResult } from "@/app/actions/search";

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeModal = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeModal]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    let active = true;
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchDb(trimmed);
        if (active) setResults(res);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 place-items-center rounded-sm border border-ink/20 text-ink transition-colors hover:bg-paper-deep"
        aria-label="Search site"
      >
        <Search className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-24 backdrop-blur-sm sm:p-6 sm:pt-32"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full max-w-xl overflow-hidden rounded-lg bg-paper shadow-panel ring-1 ring-line">
            <div className="flex items-center border-b border-line px-4">
              <Search className="h-5 w-5 text-ink/50" />
              <input
                ref={inputRef}
                className="h-14 flex-1 bg-transparent px-4 py-2 text-ink placeholder:text-ink/50 focus:outline-none"
                placeholder="Search specialties, packages..."
                value={query}
                onChange={(e) => {
                  const v = e.target.value;
                  setQuery(v);
                  if (v.trim().length < 2) setResults([]);
                }}
              />
              <button
                onClick={closeModal}
                aria-label="Close search"
                className="rounded-sm p-2 text-ink/50 hover:bg-paper-deep hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {query.trim().length >= 2 && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {loading && <div className="p-4 text-center text-sm text-ink/50">Searching...</div>}
                {!loading && results.length === 0 && (
                  <div className="p-4 text-center text-sm text-ink/50">No results found for &quot;{query}&quot;</div>
                )}
                {!loading && results.length > 0 && (
                  <ul className="space-y-1">
                    {results.map((r, i) => (
                      <li key={i}>
                        <Link
                          href={r.href}
                          onClick={closeModal}
                          className="flex items-center justify-between rounded-md p-3 hover:bg-paper-deep"
                        >
                          <span className="font-medium text-ink">{r.title}</span>
                          <span className="text-xs uppercase tracking-wider text-ink/50">{r.type}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="border-t border-line bg-paper-deep/50 px-4 py-3 text-xs text-ink/50">
              <span className="font-medium">Pro tip:</span> Press <kbd className="rounded border border-line bg-paper px-1 font-mono text-[10px]">⌘K</kbd> to search anytime
            </div>
          </div>
        </div>
      )}
    </>
  );
}
