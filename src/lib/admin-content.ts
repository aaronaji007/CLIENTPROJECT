"use client";

import { useEffect, useState, useCallback } from "react";
import { posts as defaultPosts, testimonials as defaultTestimonials, generalFaqs as defaultFaqs, journeyPhases as defaultJourney } from "./data";
import { 
  fetchAdminData, 
  createSpecialtyDb,
  updateSpecialtyDb, 
  deleteSpecialtyDb,
  createPackageDb,
  updatePackageDb,
  deletePackageDb,
  updateInquiryStatusDb,
  deleteSubscriberDb 
} from "@/app/admin/actions";
import type { ContentOverrides, TestimonialItem, FaqItem, StatItem, JourneyPhaseItem, PostItem } from "./override-context";

const OVERRIDES_KEY = "carte-clinique-content-overrides";

export const defaultStats: StatItem[] = [
  { v: 38, s: "+", l: "Countries coordinated" },
  { v: 120, s: "+", l: "Vetted partner hospitals" },
  { v: 96, s: "%", l: "Patients would refer us" },
  { v: 24, s: "/7", l: "Recovery support line" },
];

export const defaultTrust = [
  "JCI-Accredited Partners",
  "GDPR-Aligned Records",
  "Bilingual Care Coordinators",
  "Transparent Flat Pricing",
  "24/7 Recovery Line",
  "Named Clinical Lead",
];

export function useAdminContent() {
  const [resolvedSpecialties, setSpecialties] = useState<any[]>([]);
  const [resolvedPackages, setPackages] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [overrides, setOverrides] = useState<ContentOverrides>({
    specialties: {},
    packages: {},
    posts: {},
    landing: {},
    site: {},
  });

  const refreshDbData = useCallback(async () => {
    try {
      const data = await fetchAdminData();
      if (data) {
        setSpecialties(data.specialties || []);
        setPackages(data.packages || []);
        setInquiries(data.inquiries || []);
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error("Failed to load DB admin data:", err);
    }
  }, []);

  useEffect(() => {
    fetch("/api/overrides")
      .then((r) => r.json())
      .then((o) => {
        if (o && typeof o === "object") setOverrides(o);
      })
      .catch(() => {
        try {
          const raw = localStorage.getItem(OVERRIDES_KEY);
          if (raw) setOverrides(JSON.parse(raw));
        } catch {}
      });

    refreshDbData().finally(() => setLoaded(true));
  }, [refreshDbData]);

  const saveOverrides = async (next: ContentOverrides) => {
    setOverrides(next);
    try {
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
    } catch {}
    try {
      await fetch("/api/overrides", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-cc-admin": "1" },
        body: JSON.stringify(next),
      });
    } catch (e) {
      console.error("Failed to save overrides to backend:", e);
    }
  };

  const updateOverride = async (kind: string, slug: string, field: string, value: string) => {
    const next: any = { ...overrides };
    if (!next[kind]) next[kind] = {};
    if (!next[kind][slug]) next[kind][slug] = {};
    next[kind][slug][field] = value;
    await saveOverrides(next);
  };

  // Specialties CRUD
  const addSpecialty = async (data: any) => {
    setLoadingAction("addSpecialty");
    try {
      const created = await createSpecialtyDb(data);
      if (created) {
        setSpecialties((prev) => [created, ...prev]);
        return created;
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const updateSpecialty = async (slug: string, patch: any) => {
    setLoadingAction(`updateSpecialty-${slug}`);
    try {
      const updated = await updateSpecialtyDb(slug, patch);
      if (updated) {
        setSpecialties((prev) => prev.map((s) => (s.slug === slug ? { ...s, ...patch } : s)));
        return updated;
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const deleteSpecialty = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete specialty "${slug}" and all its linked packages?`)) return;
    setLoadingAction(`deleteSpecialty-${slug}`);
    try {
      await deleteSpecialtyDb(slug);
      setSpecialties((prev) => prev.filter((s) => s.slug !== slug));
      setPackages((prev) => prev.filter((p) => p.specialtyId !== slug && p.specialty?.slug !== slug));
    } finally {
      setLoadingAction(null);
    }
  };

  // Packages CRUD
  const addPackage = async (data: any) => {
    setLoadingAction("addPackage");
    try {
      const created = await createPackageDb(data);
      if (created) {
        await refreshDbData();
        return created;
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const updatePackage = async (slug: string, patch: any) => {
    setLoadingAction(`updatePackage-${slug}`);
    try {
      const updated = await updatePackageDb(slug, patch);
      if (updated) {
        await refreshDbData();
        return updated;
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const deletePackage = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete package "${slug}"?`)) return;
    setLoadingAction(`deletePackage-${slug}`);
    try {
      await deletePackageDb(slug);
      setPackages((prev) => prev.filter((p) => p.slug !== slug));
    } finally {
      setLoadingAction(null);
    }
  };

  // Inquiries & Subscribers
  const updateInquiryStatus = async (id: string, status: "new" | "read") => {
    await updateInquiryStatusDb(id, status);
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const deleteSubscriber = async (email: string) => {
    await deleteSubscriberDb(email);
    setSubscribers((prev) => prev.filter((s) => s.email !== email));
  };

  // Journal / Blog Posts
  const resolvedPosts: PostItem[] = overrides.allPosts || defaultPosts;

  const addPost = async (post: PostItem) => {
    const nextPosts = [post, ...resolvedPosts];
    const next: ContentOverrides = { ...overrides, allPosts: nextPosts };
    await saveOverrides(next);
  };

  const updatePost = async (slug: string, patch: Partial<PostItem>) => {
    const nextPosts = resolvedPosts.map((p) => (p.slug === slug ? { ...p, ...patch } : p));
    const next: ContentOverrides = { ...overrides, allPosts: nextPosts };
    await saveOverrides(next);
  };

  const deletePost = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete article "${slug}"?`)) return;
    const nextPosts = resolvedPosts.filter((p) => p.slug !== slug);
    const next: ContentOverrides = { ...overrides, allPosts: nextPosts };
    await saveOverrides(next);
  };

  // Testimonials
  const resolvedTestimonials: TestimonialItem[] = overrides.testimonials || defaultTestimonials;
  const updateTestimonials = async (testimonials: TestimonialItem[]) => {
    const next: ContentOverrides = { ...overrides, testimonials };
    await saveOverrides(next);
  };

  // FAQs
  const resolvedFaqs: FaqItem[] = overrides.faqs || defaultFaqs;
  const updateFaqs = async (faqs: FaqItem[]) => {
    const next: ContentOverrides = { ...overrides, faqs };
    await saveOverrides(next);
  };

  // Stats
  const resolvedStats: StatItem[] = overrides.stats || defaultStats;
  const updateStats = async (stats: StatItem[]) => {
    const next: ContentOverrides = { ...overrides, stats };
    await saveOverrides(next);
  };

  // Trust Marquee
  const resolvedTrust: string[] = overrides.trust || defaultTrust;
  const updateTrust = async (trust: string[]) => {
    const next: ContentOverrides = { ...overrides, trust };
    await saveOverrides(next);
  };

  // Patient Journey
  const resolvedJourney: JourneyPhaseItem[] = overrides.journey || defaultJourney;
  const updateJourney = async (journey: JourneyPhaseItem[]) => {
    const next: ContentOverrides = { ...overrides, journey };
    await saveOverrides(next);
  };

  const resetAll = async () => {
    if (!confirm("Are you sure you want to reset all site overrides back to factory default?")) return;
    const empty: ContentOverrides = {
      specialties: {},
      packages: {},
      posts: {},
      landing: {},
      site: {},
    };
    await saveOverrides(empty);
  };

  return {
    loaded,
    loadingAction,
    overrides,
    saveOverrides,
    updateOverride,
    // Specialties & Surgeries
    resolvedSpecialties,
    addSpecialty,
    updateSpecialty,
    deleteSpecialty,
    // Packages & Pricing
    resolvedPackages,
    addPackage,
    updatePackage,
    deletePackage,
    // Posts / Journal
    resolvedPosts,
    addPost,
    updatePost,
    deletePost,
    // Testimonials, FAQs, Stats, Trust, Journey
    resolvedTestimonials,
    updateTestimonials,
    resolvedFaqs,
    updateFaqs,
    resolvedStats,
    updateStats,
    resolvedTrust,
    updateTrust,
    resolvedJourney,
    updateJourney,
    // Inquiries & Subscribers
    inquiries,
    setInquiries,
    subscribers,
    setSubscribers,
    updateInquiryStatus,
    deleteSubscriber,
    resetAll,
    refreshDbData,
  };
}
