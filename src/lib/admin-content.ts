"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  posts as defaultPosts,
  testimonials as defaultTestimonials,
  generalFaqs as defaultFaqs,
  journeyPhases as defaultJourney,
} from "./data";
import {
  fetchAdminData,
  createSpecialtyDb,
  updateSpecialtyDb,
  deleteSpecialtyDb,
  createPackageDb,
  updatePackageDb,
  deletePackageDb,
  updateInquiryStatusDb,
  deleteSubscriberDb,
  type SpecialtyRow,
  type PackageRow,
  type InquiryRow,
  type SubscriberRow,
} from "@/app/admin/actions";
import type {
  ContentOverrides,
  TestimonialItem,
  FaqItem,
  StatItem,
  JourneyPhaseItem,
  PostItem,
} from "./override-context";

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
  "End-to-End Care Coordination",
  "24/7 Recovery Line",
  "Named Clinical Lead",
];

type CreateSpecialtyInput = Parameters<typeof createSpecialtyDb>[0];
type CreatePackageInput = Parameters<typeof createPackageDb>[0];

export function useAdminContent() {
  const [resolvedSpecialties, setSpecialties] = useState<SpecialtyRow[]>([]);
  const [resolvedPackages, setPackages] = useState<PackageRow[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [overrides, setOverrides] = useState<ContentOverrides>({
    specialties: {},
    packages: {},
    posts: {},
    landing: {},
    site: {},
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overridesRef = useRef<ContentOverrides>(overrides);
  useEffect(() => {
    overridesRef.current = overrides;
  }, [overrides]);

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
    let active = true;

    const loadOverrides = fetch("/api/overrides")
      .then((r) => r.json())
      .then((o: unknown) => {
        if (active && o && typeof o === "object") {
          setOverrides((prev) => ({ ...prev, ...(o as Partial<ContentOverrides>) }));
        }
      })
      .catch(() => {
        try {
          const raw = localStorage.getItem(OVERRIDES_KEY);
          if (active && raw) setOverrides((prev) => ({ ...prev, ...JSON.parse(raw) }));
        } catch {
          /* ignore */
        }
      });

    const loadDb = fetchAdminData()
      .then((data) => {
        if (active && data) {
          setSpecialties(data.specialties || []);
          setPackages(data.packages || []);
          setInquiries(data.inquiries || []);
          setSubscribers(data.subscribers || []);
        }
      })
      .catch((err) => console.error("Failed to load DB admin data:", err));

    Promise.all([loadOverrides, loadDb]).finally(() => {
      if (active) setLoaded(true);
    });

    return () => {
      active = false;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const persistOverridesToServer = async (next: ContentOverrides) => {
    try {
      const res = await fetch("/api/overrides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const msg =
          res.status === 401
            ? "Your admin session has expired. Please sign in again — changes were NOT published."
            : "Saving failed on the server — changes were NOT published.";
        alert(msg);
      }
    } catch (e) {
      console.error("Failed to save overrides to backend:", e);
    }
  };

  const saveOverrides = async (next: ContentOverrides) => {
    setOverrides(next);
    try {
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    await persistOverridesToServer(next);
  };

  const updateOverride = (
    kind: "specialties" | "packages" | "posts" | "landing" | "site",
    slug: string,
    field: string,
    value: string,
  ) => {
    const prev = overridesRef.current;
    const bucket = { ...(prev[kind] || {}) } as Record<string, Record<string, unknown>>;
    bucket[slug] = { ...(bucket[slug] || {}), [field]: value };
    const next = { ...prev, [kind]: bucket } as ContentOverrides;
    overridesRef.current = next;
    setOverrides(next);
    try {
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void persistOverridesToServer(next);
    }, 450);
  };

  // Specialties CRUD
  const addSpecialty = async (data: CreateSpecialtyInput) => {
    setLoadingAction("addSpecialty");
    try {
      const created = await createSpecialtyDb(data);
      if (created) {
        setSpecialties((prev) => [created, ...prev]);
        return created;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create specialty.");
    } finally {
      setLoadingAction(null);
    }
  };

  const updateSpecialty = async (slug: string, patch: Record<string, unknown>) => {
    setLoadingAction(`updateSpecialty-${slug}`);
    try {
      const updated = await updateSpecialtyDb(slug, patch);
      if (updated) {
        setSpecialties((prev) =>
          prev.map((s) => (s.slug === slug ? ({ ...s, ...patch } as SpecialtyRow) : s)),
        );
        return updated;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update specialty.");
    } finally {
      setLoadingAction(null);
    }
  };

  const deleteSpecialty = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete specialty "${slug}" and all its linked packages?`)) return;
    setLoadingAction(`deleteSpecialty-${slug}`);
    try {
      const target = resolvedSpecialties.find((s) => s.slug === slug);
      await deleteSpecialtyDb(slug);
      setSpecialties((prev) => prev.filter((s) => s.slug !== slug));
      setPackages((prev) =>
        prev.filter((p) => (target ? p.specialtyId !== target.id : p.specialtyId !== slug)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete specialty.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Packages CRUD
  const addPackage = async (data: CreatePackageInput) => {
    setLoadingAction("addPackage");
    try {
      const created = await createPackageDb(data);
      if (created) {
        await refreshDbData();
        return created;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create package.");
    } finally {
      setLoadingAction(null);
    }
  };

  const updatePackage = async (slug: string, patch: Record<string, unknown>) => {
    setLoadingAction(`updatePackage-${slug}`);
    try {
      const updated = await updatePackageDb(slug, patch);
      if (updated) {
        await refreshDbData();
        return updated;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update package.");
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete package.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Inquiries & Subscribers
  const updateInquiryStatus = async (id: string, status: "new" | "read") => {
    try {
      await updateInquiryStatusDb(id, status);
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update inquiry.");
    }
  };

  const deleteSubscriber = async (email: string) => {
    try {
      await deleteSubscriberDb(email);
      setSubscribers((prev) => prev.filter((s) => s.email !== email));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove subscriber.");
    }
  };

  // Journal / Blog Posts
  const resolvedPosts: PostItem[] = overrides.allPosts || defaultPosts;

  const addPost = async (post: PostItem) => {
    const nextPosts = [post, ...resolvedPosts];
    await saveOverrides({ ...overrides, allPosts: nextPosts });
  };

  const updatePost = async (slug: string, patch: Partial<PostItem>) => {
    const nextPosts = resolvedPosts.map((p) => (p.slug === slug ? { ...p, ...patch } : p));
    await saveOverrides({ ...overrides, allPosts: nextPosts });
  };

  const deletePost = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete article "${slug}"?`)) return;
    const nextPosts = resolvedPosts.filter((p) => p.slug !== slug);
    await saveOverrides({ ...overrides, allPosts: nextPosts });
  };

  // Testimonials, FAQs, Stats, Trust, Journey
  const resolvedTestimonials: TestimonialItem[] = overrides.testimonials || defaultTestimonials;
  const updateTestimonials = async (testimonials: TestimonialItem[]) => {
    await saveOverrides({ ...overrides, testimonials });
  };

  const resolvedFaqs: FaqItem[] = overrides.faqs || defaultFaqs;
  const updateFaqs = async (faqs: FaqItem[]) => {
    await saveOverrides({ ...overrides, faqs });
  };

  const resolvedStats: StatItem[] = overrides.stats || defaultStats;
  const updateStats = async (stats: StatItem[]) => {
    await saveOverrides({ ...overrides, stats });
  };

  const resolvedTrust: string[] = overrides.trust || defaultTrust;
  const updateTrust = async (trust: string[]) => {
    await saveOverrides({ ...overrides, trust });
  };

  const resolvedJourney: JourneyPhaseItem[] = overrides.journey || defaultJourney;
  const updateJourney = async (journey: JourneyPhaseItem[]) => {
    await saveOverrides({ ...overrides, journey });
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
    resolvedSpecialties,
    addSpecialty,
    updateSpecialty,
    deleteSpecialty,
    resolvedPackages,
    addPackage,
    updatePackage,
    deletePackage,
    resolvedPosts,
    addPost,
    updatePost,
    deletePost,
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
