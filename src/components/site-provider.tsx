"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { ContentOverrideProvider } from "@/lib/override-context";

type ModalState = { open: boolean; intent?: string; session: number };

type SiteContextValue = {
  inquiry: ModalState;
  openInquiry: (intent?: string) => void;
  closeInquiry: () => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [inquiry, setInquiry] = useState<ModalState>({ open: false, session: 0 });

  const openInquiry = useCallback((intent?: string) => {
    setInquiry((prev) => ({ open: true, intent, session: prev.session + 1 }));
  }, []);

  const closeInquiry = useCallback(() => {
    setInquiry((prev) => ({ open: false, intent: prev.intent, session: prev.session }));
  }, []);

  return (
    <SiteContext.Provider value={{ inquiry, openInquiry, closeInquiry }}>
      <ContentOverrideProvider>{children}</ContentOverrideProvider>
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
