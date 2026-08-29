"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth";
import { Emblem } from "@/components/header";

export default function AdminLoginPage() {
  const { authed, login, error } = useAdminAuth();
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
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
                Carte Clinique
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink/60">
            Mock credentials for this demonstration — swap for a real provider (e.g. Firebase) in
            the auth layer.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login(username, password);
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
              className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-panel transition-colors hover:bg-ink-soft"
            >
              Sign in
            </button>
          </form>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
            Demo · admin / admin
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
