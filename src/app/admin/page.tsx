"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth";
import { useAdminContent } from "@/lib/admin-content";

type Inquiry = {
  id: string;
  at: string;
  condition: string;
  procedure: string;
  timeline: string;
  name: string;
  email: string;
  country: string;
  notes: string;
  files: string[];
  status: "new" | "read";
};

type Tab = "overview" | "site-copy" | "specialties" | "packages" | "journal" | "photos" | "inquiries" | "audience";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "site-copy", label: "Site Copy" },
  { id: "specialties", label: "Specialties" },
  { id: "packages", label: "Packages" },
  { id: "journal", label: "Journal" },
  { id: "photos", label: "Photos" },
  { id: "inquiries", label: "Inquiries" },
  { id: "audience", label: "Audience" },
];

export default function AdminDashboard() {
  const { authed, logout } = useAdminAuth();
  const [tab, setTab] = useState<Tab>("overview");

  if (authed !== true) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/50">
          Checking your session…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">Admin console</p>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
            Carte Clinique dashboard
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
            Content edits are stored in your browser (localStorage) and structured to swap to a real
            backend later. This is a demonstration control panel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab("overview")}
            className="rounded-sm border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:border-ink"
            aria-pressed={tab === "overview"}
          >
            Overview
          </button>
          <Link
            href="/"
            className="rounded-sm border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:border-ink"
          >
            View site
          </Link>
          <button
            onClick={logout}
            className="rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink-soft"
          >
            Sign out
          </button>
        </div>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Admin sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-ink text-paper"
                : "border border-ink/20 text-ink hover:border-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "overview" && <Overview />}
        {tab === "site-copy" && <SiteCopyEditor />}
        {tab === "specialties" && <SpecialtiesEditor />}
        {tab === "packages" && <PackagesEditor />}
        {tab === "journal" && <JournalEditor />}
        {tab === "photos" && <PhotosEditor />}
        {tab === "inquiries" && <InquiriesInbox />}
        {tab === "audience" && <AudiencePanel />}
      </div>
    </div>
  );
}

function Overview() {
  const { resolvedSpecialties, resolvedPackages, resolvedPosts, resetAll, inquiries, subscribers } = useAdminContent();

  const stats = [
    { label: "Specialties", value: resolvedSpecialties.length },
    { label: "Packages", value: resolvedPackages.length },
    { label: "Journal posts", value: resolvedPosts.length },
    {
      label: "Inquiries",
      value: inquiries.filter((i) => i.status === "new").length || 0,
      accent: true,
    },
    { label: "Subscribers", value: subscribers.length },
  ];

  const lastInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-line bg-paper p-6 shadow-panel"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
              {s.label}
            </p>
            <p
              className={`mt-2 font-display text-4xl font-medium ${
                s.accent ? "text-signal" : "text-ink"
              }`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-paper shadow-panel">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-medium text-ink">Recent inquiries</h2>
          <span className="font-mono text-xs text-ink/50">demo inbox</span>
        </div>
        {lastInquiries.length === 0 ? (
          <p className="px-6 py-10 text-sm text-ink/55">
            No inquiries yet. Submit one from the site (Plan your care) and it appears here.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {lastInquiries.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {i.name} · {i.condition}
                  </p>
                  <p className="truncate text-xs text-ink/55">
                    {new Date(i.createdAt).toLocaleString()} · {i.timeline}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${
                    i.status === "new" ? "bg-signal/10 text-signal" : "bg-paper-deep text-ink/50"
                  }`}
                >
                  {i.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-line bg-paper-deep/40 p-6">
        <h2 className="font-display text-lg font-medium text-ink">Content storage</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Edit specialties, packages, and journal posts below; changes save to this browser.
          They are not pushed to the public pages — this demo keeps edits local. To return to
          defaults:
        </p>
        <button
          onClick={resetAll}
          className="mt-3 rounded-sm border border-signal/40 px-4 py-2 text-sm font-medium text-signal hover:bg-signal/5"
        >
          Reset all content edits
        </button>
      </div>
    </div>
  );
}

function FieldRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2 text-sm text-ink focus:border-ink"
      />
    </label>
  );
}

function TextAreaRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2 text-sm text-ink focus:border-ink"
      />
    </label>
  );
}

function SiteCopyEditor() {
  const { overrides, updateOverride } = useAdminContent();
  const landing = overrides.landing?.home || {};
  const site = overrides.site?.global || {};

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel">
        <h2 className="font-display text-xl font-medium text-ink">Landing Page Text</h2>
        <div className="mt-5 grid gap-4">
          <FieldRow
            label="Hero Title"
            value={landing.heroTitle || "Global access to exceptional care."}
            onChange={(v) => updateOverride("landing", "home", "heroTitle", v)}
          />
          <TextAreaRow
            label="Hero Subtitle"
            value={landing.heroSubtitle || "Carte Clinique is a private medical concierge connecting patients with Europe and Asia's leading accredited hospitals."}
            onChange={(v) => updateOverride("landing", "home", "heroSubtitle", v)}
          />
          <TextAreaRow
            label="Scrambled Intro Text"
            value={landing.scrambledText || "From the first message to your final follow-up, the same person holds the thread. Records move with you. Decisions are documented. Nothing about your care is left to chance or to a call center."}
            onChange={(v) => updateOverride("landing", "home", "scrambledText", v)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel">
        <h2 className="font-display text-xl font-medium text-ink">Global Site Copy</h2>
        <div className="mt-5 grid gap-4">
          <FieldRow
            label="Footer Title"
            value={site.footerTitle || "Carte Clinique"}
            onChange={(v) => updateOverride("site", "global", "footerTitle", v)}
          />
        </div>
      </div>
    </div>
  );
}

function SpecialtiesEditor() {
  const { resolvedSpecialties, overrides, updateSpecialty } = useAdminContent();
  return (
    <div className="space-y-6">
      {resolvedSpecialties.map((s) => (
        <div key={s.slug} className="rounded-lg border border-line bg-paper p-6 shadow-panel">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                {s.category}
              </p>
              <h3 className="mt-1 font-display text-xl font-medium text-ink">{s.name}</h3>
            </div>
            <Link
              href={`/specialties/${s.slug}`}
              className="text-sm font-medium text-ink/60 hover:text-ink"
            >
              View →
            </Link>
          </div>
          <div className="mt-5 grid gap-4">
            <FieldRow
              label="Display name"
              value={s.name}
              onChange={(v) => updateSpecialty(s.slug, { name: v })}
            />
            <TextAreaRow
              label="Summary (card)"
              value={s.summary}
              onChange={(v) => updateSpecialty(s.slug, { summary: v })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PackagesEditor() {
  const { resolvedPackages, updatePackage } = useAdminContent();
  return (
    <div className="space-y-6">
      {resolvedPackages.map((p) => (
        <div key={p.slug} className="rounded-lg border border-line bg-paper p-6 shadow-panel">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                {p.specialty?.name || p.specialtyId} · {p.country}
              </p>
              <h3 className="mt-1 font-display text-xl font-medium text-ink">{p.name}</h3>
            </div>
            <Link href={`/packages/${p.slug}`} className="text-sm font-medium text-ink/60 hover:text-ink">
              View →
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FieldRow
              label="Display name"
              value={p.name}
              onChange={(v) => updatePackage(p.slug, { name: v })}
            />
            <FieldRow
              label="Price (numeric)"
              value={String(p.price)}
              onChange={(v) => updatePackage(p.slug, { price: v })}
            />
            <div className="sm:col-span-2">
              <TextAreaRow
                label="Summary (card)"
                value={p.summary}
                onChange={(v) => updatePackage(p.slug, { summary: v })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function JournalEditor() {
  const { resolvedPosts, updatePost } = useAdminContent();
  return (
    <div className="space-y-6">
      {resolvedPosts.map((p) => (
        <div key={p.slug} className="rounded-lg border border-line bg-paper p-6 shadow-panel">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                {p.category}
              </p>
              <h3 className="mt-1 font-display text-xl font-medium text-ink">{p.title}</h3>
            </div>
            <Link href={`/blog/${p.slug}`} className="text-sm font-medium text-ink/60 hover:text-ink">
              View →
            </Link>
          </div>
          <div className="mt-5 grid gap-4">
            <FieldRow
              label="Title"
              value={p.title}
              onChange={(v) => updatePost(p.slug, { title: v })}
            />
            <TextAreaRow
              label="Excerpt"
              value={p.excerpt}
              onChange={(v) => updatePost(p.slug, { excerpt: v })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PhotoFieldRow({
  id,
  label,
  value,
  onChange,
  onReset,
  preview,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;
  preview?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => document.getElementById(`photo-upload-${id}`)?.click()}
        className={`h-24 w-36 shrink-0 cursor-pointer overflow-hidden rounded-sm border border-dashed bg-paper-deep/50 text-center transition-colors ${
          dragging ? "border-signal bg-signal/10" : "border-line hover:border-ink/40"
        }`}
        title="Drop an image here or click to choose"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="pointer-events-none h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-1 font-mono text-[10px] uppercase tracking-wider text-ink/40">
            {uploading ? "Uploading…" : "Drop to set"}
          </div>
        )}
        <input
          id={`photo-upload-${id}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.currentTarget.value = "";
          }}
        />
      </div>
      <div className="min-w-[220px] flex-1">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{label}</span>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/your-photo.webp"
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-white/40 px-3 py-2 font-mono text-xs text-ink focus:border-ink"
          />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-ink/45">
          Drag an image onto the preview, or click it to choose a file. It uploads to the site and
          updates live.
        </p>
        {error && (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-signal">{error}</p>
        )}
        <button
          onClick={onReset}
          className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink/45 hover:text-signal"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}

function PhotosEditor() {
  const {
    resolvedSpecialties,
    resolvedPackages,
    resolvedPosts,
    overrides,
    updateSpecialty,
    updatePackage,
    updatePost,
    resetPhoto,
  } = useAdminContent();

  const groups: {
    key: string;
    title: string;
    hint: string;
    items: {
      slug: string;
      name: string;
      sub: string;
      photo: string;
      onChange: (v: string) => void;
      onReset: () => void;
    }[];
  }[] = [
    {
      key: "specialties",
      title: "Specialties",
      hint: "Card & detail-page imagery",
      items: resolvedSpecialties.map((s) => ({
        slug: s.slug,
        name: s.name,
        sub: s.category,
        photo: overrides.specialties?.[s.slug]?.photo ?? s.photo,
        onChange: (v) => updateSpecialty(s.slug, { photo: v }),
        onReset: () => resetPhoto("specialties", s.slug),
      })),
    },
    {
      key: "packages",
      title: "Packages",
      hint: "Package card & travel imagery",
      items: resolvedPackages.map((p) => ({
        slug: p.slug,
        name: p.name,
        sub: `${p.specialty} · ${p.country}`,
        photo: overrides.packages?.[p.slug]?.photo ?? p.photo,
        onChange: (v) => updatePackage(p.slug, { photo: v }),
        onReset: () => resetPhoto("packages", p.slug),
      })),
    },
    {
      key: "posts",
      title: "Journal",
      hint: "Blog card & article imagery",
      items: resolvedPosts.map((p) => ({
        slug: p.slug,
        name: p.title,
        sub: p.category,
        photo: overrides.posts?.[p.slug]?.photo ?? p.photo,
        onChange: (v) => updatePost(p.slug, { photo: v }),
        onReset: () => resetPhoto("posts", p.slug),
      })),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-line bg-paper-deep/40 p-6">
        <h2 className="font-display text-lg font-medium text-ink">Photo library</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Change the photograph used on each specialty, package, and journal post. Drag an image on,
          click to choose a file, or paste a URL — it instantly updates the live site. Uploaded
          photos are saved to the site; the selection is stored in this browser.
        </p>
      </div>
      {groups.map((g) => (
        <section key={g.key} className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-medium text-ink">{g.title}</h2>
            <span className="font-mono text-xs text-ink/45">{g.hint}</span>
          </div>
          {g.items.map((item) => (
            <div key={item.slug} className="rounded-lg border border-line bg-paper p-6 shadow-panel">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">{item.sub}</p>
              <h3 className="mt-1 font-display text-lg font-medium text-ink">{item.name}</h3>
              <div className="mt-4">
                <PhotoFieldRow
                  id={item.slug}
                  label="Photo"
                  value={item.photo}
                  onChange={item.onChange}
                  onReset={item.onReset}
                  preview={item.photo}
                />
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function InquiriesInbox() {
  const { inquiries, setInquiries, updateInquiryStatusDb } = useAdminContent();

  const mark = async (id: string, status: "read" | "new") => {
    const next = inquiries.map((i) => (i.id === id ? { ...i, status } : i));
    setInquiries(next);
    await updateInquiryStatusDb(id, status);
  };

  if (inquiries.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-paper p-12 text-center shadow-panel">
        <p className="font-display text-xl font-medium text-ink">No inquiries submitted yet</p>
        <p className="mt-2 text-sm text-ink/55">
          Open the live site and complete the &ldquo;Plan your care&rdquo; flow — submissions appear
          in this inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((i) => (
        <div key={i.id} className="rounded-lg border border-line bg-paper p-6 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-medium text-ink">
                {i.name} <span className="font-mono text-xs text-ink/50">({i.email})</span>
              </p>
              <p className="mt-1 text-sm text-ink/55">
                {new Date(i.createdAt).toLocaleString()} · {i.country || "no country"}
              </p>
            </div>
            <button
              onClick={() => mark(i.id, i.status === "new" ? "read" : "new")}
              className={`rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
                i.status === "new"
                  ? "bg-signal/10 text-signal"
                  : "bg-paper-deep text-ink/60"
              }`}
            >
              {i.status} — toggle
            </button>
          </div>

          <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">Condition</dt>
              <dd className="text-ink">{i.condition}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">Procedure</dt>
              <dd className="text-ink">{i.procedure || "To be advised"}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">Timing</dt>
              <dd className="text-ink">{i.timeline}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">Documents</dt>
              <dd className="text-ink">{i.files.length ? i.files.join(", ") : "None"}</dd>
            </div>
          </dl>

          {i.notes && (
            <p className="mt-3 rounded-sm bg-paper-deep/50 px-3 py-2 text-sm text-ink/70">
              {i.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function AudiencePanel() {
  const { subscribers, setSubscribers, deleteSubscriberDb } = useAdminContent();

  const remove = async (email: string) => {
    const next = subscribers.filter((s) => s.email !== email);
    setSubscribers(next);
    await deleteSubscriberDb(email);
  };

  return (
    <div className="rounded-lg border border-line bg-paper shadow-panel">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <div>
          <h2 className="font-display text-xl font-medium text-ink">Newsletter subscribers</h2>
          <p className="mt-1 text-sm text-ink/55">Emails captured from the footer signup (demo, localStorage).</p>
        </div>
        <span className="rounded-sm bg-paper-deep px-3 py-1.5 font-mono text-xs text-ink/70">
          {subscribers.length} total
        </span>
      </div>

      {subscribers.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-ink/55">
          No subscribers yet. Sign up via the footer on the live site and they appear here.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {subscribers.map((s) => (
            <li key={s.email} className="flex items-center justify-between gap-4 px-6 py-3.5">
              <span className="truncate text-sm text-ink">{s.email}</span>
              <button
                onClick={() => remove(s.email)}
                className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-signal hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
