"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ContentOverrides } from "./admin-content";

const OVERRIDES_KEY = "carte-clinique-content-overrides";

const EMPTY: ContentOverrides = { specialties: {}, packages: {}, posts: {} };

const ContentOverrideContext = createContext<ContentOverrides>(EMPTY);

export function ContentOverrideProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<ContentOverrides>(EMPTY);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(OVERRIDES_KEY);
        setOverrides(raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY);
      } catch {
        setOverrides(EMPTY);
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  return (
    <ContentOverrideContext.Provider value={overrides}>{children}</ContentOverrideContext.Provider>
  );
}

export function useContentOverrides() {
  return useContext(ContentOverrideContext);
}
