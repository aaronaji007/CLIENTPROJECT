"use client";

import { useEffect, useState, useCallback } from "react";
import { posts } from "./data";
import { 
  fetchAdminData, 
  updateSpecialtyDb, 
  updatePackageDb,
  updateInquiryStatusDb,
  deleteSubscriberDb 
} from "@/app/admin/actions";

const OVERRIDES_KEY = "carte-clinique-content-overrides";

export function useAdminContent() {
  const [resolvedSpecialties, setSpecialties] = useState<any[]>([]);
  const [resolvedPackages, setPackages] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Still keep local posts since they aren't in DB right now
  const [resolvedPosts, setPosts] = useState(posts);
  const [overrides, setOverrides] = useState({ posts: {} } as any);

  useEffect(() => {
    fetchAdminData().then(data => {
      setSpecialties(data.specialties);
      setPackages(data.packages);
      setInquiries(data.inquiries);
      setSubscribers(data.subscribers);
      setLoaded(true);
    });
  }, []);

  const updateSpecialty = async (slug: string, patch: any) => {
    const updated = await updateSpecialtyDb(slug, patch);
    if (updated) {
      setSpecialties(prev => prev.map(s => s.slug === slug ? { ...s, ...patch } : s));
    }
  };

  const updatePackage = async (slug: string, patch: { name?: string; summary?: string; price?: string; photo?: string }) => {
    // If price is string in DB, handle conversion if needed
    const updated = await updatePackageDb(slug, patch);
    if (updated) {
      setPackages(prev => prev.map(p => p.slug === slug ? { ...p, ...patch } : p));
    }
  };

  const updatePost = (slug: string, patch: any) => {
    // Just update locally
  };

  const resetPhoto = async (kind: "specialties" | "packages" | "posts", slug: string) => {
    // ... not fully implemented since DB holds single truth
  };

  const resetAll = () => {};

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
    inquiries,
    subscribers,
    setInquiries,
    setSubscribers,
    updateInquiryStatusDb,
    deleteSubscriberDb
  };
}
