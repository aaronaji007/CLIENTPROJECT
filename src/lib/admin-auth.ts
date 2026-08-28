"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const MOCK_CREDENTIALS = {
  username: "admin",
  password: "admin",
};

const SESSION_KEY = "carte-clinique-admin";

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);
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
    (username: string, password: string) => {
      if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setAuthed(true);
        setError(null);
        router.replace("/admin");
        return true;
      }
      setError("That combination did not match. Try admin / admin.");
      return false;
    },
    [router],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    router.replace("/admin/login");
  }, [router]);

  return { authed, login, logout, error };
}
