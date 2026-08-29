"use client";

import { useEffect, useState, useCallback } from "react";
import { specialties, packages, posts } from "./data";

const OVERRIDES_KEY = "carte-clinique-content-overrides";

export type ContentOverrides = {
  specialties: Record<string, { name?: string; summary?: string; photo?: string }>;
  packages: Record<string, { name?: string; summary?: string; price?: string; photo?: string }>;
  posts: Record<string, { title?: string; excerpt?: string; photo?: string }>;
};

export const defaultOverrides: ContentOverrides = {
  specialties: {},
  packages: {},
  posts: {},
};

const ADMIN_HEADER = "x-cc-admin";
let pushTimer: ReturnType<typeof setTimeout> | null = null;

const pushToServer = (next: ContentOverrides) => {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    fetch("/api/overrides", {
      method: "PUT",
      headers: { "Content-Type": "application/json", [ADMIN_HEADER]: "1" },
      body: JSON.stringify(next),
    }).catch(() => {});
  }, 400);
};

export function useAdminContent() {
  const [overrides, setOverrides] = useState<ContentOverrides>(defaultOverrides);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(OVERRIDES_KEY);
        setOverrides(raw ? { ...defaultOverrides, ...JSON.parse(raw) } : defaultOverrides);
      } catch {
        setOverrides(defaultOverrides);
      }
      setLoaded(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const persist = useCallback((next: ContentOverrides) => {
    setOverrides(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
    }
    pushToServer(next);
  }, []);

  const updateSpecialty = (slug: string, patch: { name?: string; summary?: string; photo?: string }) => {
    persist({
      ...overrides,
      specialties: { ...overrides.specialties, [slug]: { ...overrides.specialties[slug], ...patch } },
    });
  };

  const updatePackage = (slug: string, patch: { name?: string; summary?: string; price?: string; photo?: string }) => {
    persist({
      ...overrides,
      packages: { ...overrides.packages, [slug]: { ...overrides.packages[slug], ...patch } },
    });
  };

  const updatePost = (slug: string, patch: { title?: string; excerpt?: string; photo?: string }) => {
    persist({
      ...overrides,
      posts: { ...overrides.posts, [slug]: { ...overrides.posts[slug], ...patch } },
    });
  };

  const resetPhoto = (kind: "specialties" | "packages" | "posts", slug: string) => {
    const list = overrides[kind];
    const current = list[slug] || {};
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(current)) {
      if (k !== "photo") cleaned[k] = v as string;
    }
    persist({ ...overrides, [kind]: { ...list, [slug]: cleaned } });
  };

  const resetAll = () => persist(defaultOverrides);

  const resolvedSpecialties = specialties.map((s) => ({
    ...s,
    ...(overrides.specialties[s.slug] || {}),
  }));
  const resolvedPackages = packages.map((p) => ({
    ...p,
    ...(overrides.packages[p.slug] || {}),
  }));
  const resolvedPosts = posts.map((p) => ({
    ...p,
    ...(overrides.posts[p.slug] || {}),
  }));

  return {
    loaded,
    overrides,
    updateSpecialty,
    updatePackage,
    updatePost,
    resetPhoto,
    resetAll,
    resolvedSpecialties,
    resolvedPackages,
    resolvedPosts,
  };
}
