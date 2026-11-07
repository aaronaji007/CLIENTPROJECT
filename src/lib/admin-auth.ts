"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  verifyAdminLoginAction,
  logoutAdminAction,
  getAdminSessionAction,
} from "@/app/admin/actions";

/**
 * Client-side view of the admin session.
 *
 * The real session lives in an httpOnly cookie that only the server can read
 * or write; this hook just asks the server whether it is valid. Nothing stored
 * in the browser can grant admin access.
 */
export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const s = await getAdminSessionAction();
      setAuthed(s.authed);
      setMustChangePassword(s.authed ? s.mustChangePassword : false);
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    // Clean up the legacy, forgeable flag from older versions.
    try {
      sessionStorage.removeItem("carte-clinique-admin");
    } catch {
      /* ignore */
    }
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (authed === false && window.location.pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [authed, router]);

  const login = useCallback(
    async (username: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const res = await verifyAdminLoginAction(username, password);
        if (res.success) {
          await refresh();
          router.replace("/admin");
          return true;
        }
        setError(res.error);
        return false;
      } catch {
        setError("Login failed. Please try again.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router, refresh],
  );

  const logout = useCallback(async () => {
    try {
      await logoutAdminAction();
    } finally {
      setAuthed(false);
      router.replace("/admin/login");
    }
  }, [router]);

  return { authed, mustChangePassword, refresh, login, logout, loading, error };
}
