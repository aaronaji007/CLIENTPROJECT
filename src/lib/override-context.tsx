"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ContentOverrides } from "./admin-content";

const OVERRIDES_KEY = "carte-clinique-content-overrides";

const EMPTY: ContentOverrides = { specialties: {}, packages: {}, posts: {} };

const ContentOverrideContext = createContext<ContentOverrides>(EMPTY);

export function ContentOverrideProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<ContentOverrides>(EMPTY);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/overrides");
        if (res.ok) {
          const data = await res.json();
          if (active) setOverrides({ ...EMPTY, ...data });
          return;
        }
      } catch {
        /* server unreachable — fall back to localStorage below */
      }
      try {
        const raw = localStorage.getItem(OVERRIDES_KEY);
        if (active) setOverrides(raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY);
      } catch {
        if (active) setOverrides(EMPTY);
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
