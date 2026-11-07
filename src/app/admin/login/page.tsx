"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth";
import { Emblem } from "@/components/header";

export default function AdminLoginPage() {
  const { authed, login, loading, error } = useAdminAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authedRef = useRef(authed);
  useEffect(() => {
    authedRef.current = authed;
  }, [authed]);
  useEffect(() => {
    if (authedRef.current) router.replace("/admin");
  }, [authed, router]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-line bg-paper p-8 shadow-panel">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/20">
              <Emblem />
            </span>
            <div>
              <h1 className="font-display text-xl font-medium text-ink">Admin sign in</h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal font-semibold">
                MedyCare 2₹ism
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            Sign in to access the MedyCare Control Panel and content management system.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) login(username, password);
            }}
          >
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
                Username
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="admin"
                className="mt-1.5 w-full rounded-sm border border-line bg-white/50 px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-sm border border-line bg-white/50 px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
            </label>

            {error && (
              <p className="rounded-sm border border-signal/30 bg-signal/5 px-3 py-2 text-xs text-signal">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-panel transition-colors hover:bg-ink-soft disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
            Authorised staff only · attempts are rate limited
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-medium text-ink/60 hover:text-ink"
        >
          ← Back to the site
        </Link>
      </div>
    </div>
  );
}
