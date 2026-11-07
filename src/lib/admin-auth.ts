"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminLoginAction } from "@/app/admin/actions";

export const MOCK_CREDENTIALS = {
  username: "admin",
  password: "admin",
};

const SESSION_KEY = "carte-clinique-admin";

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setAuthed(
        typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1",
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (authed === false) router.replace("/admin/login");
  }, [authed, router]);

  const login = useCallback(
    async (username: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const res = await verifyAdminLoginAction(username, password);
        if (res.success) {
          sessionStorage.setItem(SESSION_KEY, "1");
          setAuthed(true);
          setError(null);
          router.replace("/admin");
          return true;
        }
        setError(res.error || "That combination did not match.");
        return false;
      } catch (err: any) {
        // Fallback for default demo credentials if offline
        if (username.trim().toLowerCase() === "admin" && password === "admin") {
          sessionStorage.setItem(SESSION_KEY, "1");
          setAuthed(true);
          setError(null);
          router.replace("/admin");
          return true;
        }
        setError("Login failed. Please check your credentials.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    router.replace("/admin/login");
  }, [router]);

  return { authed, login, logout, loading, error };
}
