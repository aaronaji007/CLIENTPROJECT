"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type TestimonialItem = {
  quote: string;
  name: string;
  care: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type StatItem = {
  v: number;
  s: string;
  l: string;
};

export type JourneyPhaseItem = {
  id: string;
  name: string;
  focus: string;
  actions: string[];
};

export type PostItem = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  photo?: string;
  content?: string;
};

export type ContentOverrides = {
  specialties: Record<string, { name?: string; summary?: string; photo?: string }>;
  packages: Record<string, { name?: string; summary?: string; price?: string; photo?: string }>;
  posts: Record<string, Partial<PostItem>>;
  allPosts?: PostItem[];
  landing?: Record<string, Record<string, string>>;
  site?: Record<string, Record<string, string>>;
  testimonials?: TestimonialItem[];
  faqs?: FaqItem[];
  stats?: StatItem[];
  trust?: string[];
  journey?: JourneyPhaseItem[];
};

const OVERRIDES_KEY = "carte-clinique-content-overrides";

export const EMPTY_OVERRIDES: ContentOverrides = {
  specialties: {},
  packages: {},
  posts: {},
  landing: {},
  site: {},
};

const ContentOverrideContext = createContext<ContentOverrides>(EMPTY_OVERRIDES);

export function ContentOverrideProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<ContentOverrides>(EMPTY_OVERRIDES);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/overrides", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (active) setOverrides({ ...EMPTY_OVERRIDES, ...data });
          return;
        }
      } catch {
        /* server unreachable — fall back to localStorage below */
      }
      try {
        const raw = localStorage.getItem(OVERRIDES_KEY);
        if (active) setOverrides(raw ? { ...EMPTY_OVERRIDES, ...JSON.parse(raw) } : EMPTY_OVERRIDES);
      } catch {
        if (active) setOverrides(EMPTY_OVERRIDES);
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => {
      active = false;
      window.removeEventListener("storage", load);
    };
  }, []);

  return (
    <ContentOverrideContext.Provider value={overrides}>{children}</ContentOverrideContext.Provider>
  );
}

export function useContentOverrides() {
  return useContext(ContentOverrideContext);
}
