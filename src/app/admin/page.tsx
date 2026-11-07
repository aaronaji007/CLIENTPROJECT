"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth";
import { useAdminContent } from "@/lib/admin-content";
import type { TestimonialItem, FaqItem, StatItem, JourneyPhaseItem, PostItem } from "@/lib/override-context";
import { getAdminAccountInfoAction, changeAdminPasswordAction } from "./actions";

type Tab =
  | "overview"
  | "specialties"
  | "packages"
  | "site-copy"
  | "stats"
  | "journey"
  | "testimonials"
  | "faqs"
  | "journal"
  | "footer"
  | "photos"
  | "inquiries"
  | "audience"
  | "security";

const tabs: { id: Tab; label: string; badge?: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "specialties", label: "Surgeries & Specialties", badge: "DB" },
  { id: "packages", label: "Packages & Pricing", badge: "DB" },
  { id: "site-copy", label: "Hero & Copy" },
  { id: "stats", label: "Metrics & Trust" },
  { id: "journey", label: "Patient Journey" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faqs", label: "FAQs" },
  { id: "journal", label: "Journal / Blog" },
  { id: "footer", label: "Contacts & Footer" },
  { id: "photos", label: "Media Library" },
  { id: "inquiries", label: "Inquiries Inbox" },
  { id: "audience", label: "Subscribers" },
  { id: "security", label: "Security & Password", badge: "AUTH" },
];

export default function AdminDashboard() {
  const { authed, logout, mustChangePassword, refresh } = useAdminAuth();
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

  // Signed in with the default/bootstrap password: the server blocks every
  // other admin action until a real password is set, so only show this screen.
  if (mustChangePassword) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto mb-6 max-w-3xl rounded-lg border border-signal/40 bg-signal/10 p-5">
          <h1 className="font-display text-2xl font-medium text-ink">Set a new admin password</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            You signed in with the default password. For security, the control panel stays locked until
            you choose a new password (at least 10 characters).
          </p>
          <button onClick={logout} className="mt-3 font-mono text-xs uppercase tracking-wider text-signal hover:underline">
            Sign out
          </button>
        </div>
        <SecurityEditor onChanged={refresh} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal font-semibold">
              Live Control Panel
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink sm:text-4xl">
            MedyCare 2₹ism Management Console
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
            Control surgeries, procedures, pricing, packages, testimonials, FAQs, and site-wide copy. Changes are saved to the database and global storage instantly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="rounded-sm border border-ink/20 px-3.5 py-2 text-xs font-medium text-ink hover:border-ink hover:bg-white/40 transition-colors"
          >
            Preview live site ↗
          </Link>
          <button
            onClick={() => setTab("security")}
            className="rounded-sm border border-signal/30 bg-signal/10 px-3.5 py-2 text-xs font-semibold text-signal hover:bg-signal/20 transition-colors flex items-center gap-1.5"
          >
            <LockIcon className="h-3.5 w-3.5" />
            <span>Change Password</span>
          </button>
          <button
            onClick={logout}
            className="rounded-sm bg-ink px-3.5 py-2 text-xs font-semibold text-paper hover:bg-ink-soft transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-1.5" aria-label="Admin sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`flex items-center gap-2 rounded-sm px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              tab === t.id
                ? "bg-ink text-paper font-semibold shadow-sm"
                : "border border-ink/15 text-ink/75 hover:border-ink hover:text-ink bg-paper"
            }`}
          >
            <span>{t.label}</span>
            {t.badge && (
              <span className={`rounded px-1.5 py-0.5 text-[9px] ${
                tab === t.id ? "bg-signal text-white" : "bg-ink/10 text-ink/70"
              }`}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "overview" && <Overview onSelectTab={setTab} />}
        {tab === "specialties" && <SpecialtiesEditor />}
        {tab === "packages" && <PackagesEditor />}
        {tab === "site-copy" && <SiteCopyEditor />}
        {tab === "stats" && <StatsEditor />}
        {tab === "journey" && <JourneyEditor />}
        {tab === "testimonials" && <TestimonialsEditor />}
        {tab === "faqs" && <FaqsEditor />}
        {tab === "journal" && <JournalEditor />}
        {tab === "footer" && <FooterEditor />}
        {tab === "photos" && <PhotosEditor />}
        {tab === "inquiries" && <InquiriesInbox />}
        {tab === "audience" && <AudiencePanel />}
        {tab === "security" && <SecurityEditor />}
      </div>
    </div>
  );
}

function Overview({ onSelectTab }: { onSelectTab: (t: Tab) => void }) {
  const {
    resolvedSpecialties,
    resolvedPackages,
    resolvedPosts,
    inquiries,
    subscribers,
    resetAll,
  } = useAdminContent();

  const totalProcedures = resolvedSpecialties.reduce(
    (acc, s) => acc + (Array.isArray(s.procedures) ? s.procedures.length : 0),
    0
  );

  const stats = [
    { label: "Specialties / Clinics", value: resolvedSpecialties.length, tab: "specialties" as Tab },
    { label: "Surgeries & Procedures", value: totalProcedures, tab: "specialties" as Tab },
    { label: "Care & Travel Packages", value: resolvedPackages.length, tab: "packages" as Tab },
    {
      label: "New Inquiries",
      value: inquiries.filter((i) => i.status === "new").length,
      accent: true,
      tab: "inquiries" as Tab,
    },
    { label: "Subscribers", value: subscribers.length, tab: "audience" as Tab },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelectTab(s.tab)}
            className="text-left rounded-lg border border-line bg-paper p-5 shadow-panel hover:border-ink/50 transition-colors"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
              {s.label}
            </p>
            <p
              className={`mt-2 font-display text-3xl font-medium ${
                s.accent ? "text-signal" : "text-ink"
              }`}
            >
              {s.value}
            </p>
            <span className="mt-3 block font-mono text-[10px] uppercase text-ink/40">
              Manage →
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-line bg-paper shadow-panel p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="font-display text-xl font-medium text-ink">Recent Inquiries</h2>
            <button
              onClick={() => onSelectTab("inquiries")}
              className="font-mono text-xs text-signal hover:underline"
            >
              View all ({inquiries.length}) →
            </button>
          </div>
          {inquiries.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink/50">No patient inquiries yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {inquiries.slice(0, 4).map((i) => (
                <li key={i.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {i.name} — <span className="text-ink/65">{i.condition}</span>
                    </p>
                    <p className="text-xs text-ink/50">
                      {i.email} · {i.country || "International"} · {new Date(i.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase ${
                      i.status === "new" ? "bg-signal/15 text-signal font-semibold" : "bg-paper-deep text-ink/60"
                    }`}
                  >
                    {i.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-line bg-paper shadow-panel p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Quick Actions</h2>
            <p className="mt-2 text-xs leading-relaxed text-ink/60">
              Direct shortcuts to edit the highest-traffic elements on the platform.
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => onSelectTab("specialties")}
                className="w-full text-left rounded-sm border border-line bg-paper-deep/40 px-3 py-2 text-xs text-ink hover:border-ink transition-colors flex items-center justify-between"
              >
                <span>➕ Add / Edit Surgeries</span>
                <span className="font-mono text-[10px] text-ink/40">DB</span>
              </button>
              <button
                onClick={() => onSelectTab("packages")}
                className="w-full text-left rounded-sm border border-line bg-paper-deep/40 px-3 py-2 text-xs text-ink hover:border-ink transition-colors flex items-center justify-between"
              >
                <span>💲 Change Surgery Package Pricing</span>
                <span className="font-mono text-[10px] text-ink/40">DB</span>
              </button>
              <button
                onClick={() => onSelectTab("site-copy")}
                className="w-full text-left rounded-sm border border-line bg-paper-deep/40 px-3 py-2 text-xs text-ink hover:border-ink transition-colors flex items-center justify-between"
              >
                <span>✏️ Edit Hero Headline & Tagline</span>
                <span className="font-mono text-[10px] text-ink/40">CMS</span>
              </button>
              <button
                onClick={() => onSelectTab("testimonials")}
                className="w-full text-left rounded-sm border border-line bg-paper-deep/40 px-3 py-2 text-xs text-ink hover:border-ink transition-colors flex items-center justify-between"
              >
                <span>💬 Edit Patient Stories</span>
                <span className="font-mono text-[10px] text-ink/40">CMS</span>
              </button>
              <button
                onClick={() => onSelectTab("security")}
                className="w-full text-left rounded-sm border border-line bg-paper-deep/40 px-3 py-2 text-xs text-ink hover:border-ink transition-colors flex items-center justify-between"
              >
                <span>🔒 Change Admin Password</span>
                <span className="font-mono text-[10px] text-signal font-semibold">AUTH</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line">
            <button
              onClick={resetAll}
              className="w-full rounded-sm border border-signal/30 px-3 py-1.5 text-xs font-mono uppercase text-signal hover:bg-signal/10 transition-colors"
            >
              Reset Content Overrides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. SURGERIES & SPECIALTIES MANAGER
// -------------------------------------------------------------
function SpecialtiesEditor() {
  const {
    resolvedSpecialties,
    addSpecialty,
    updateSpecialty,
    deleteSpecialty,
    loadingAction,
  } = useAdminContent();

  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // New Specialty Form State
  const [newSpec, setNewSpec] = useState({
    name: "",
    slug: "",
    category: "",
    tagline: "",
    travelDays: "Stay 3–8 days (Procedure dependent)",
    summary: "",
    overview: "",
    recovery: "In-hospital mobilization with structured outpatient physiotherapy and remote follow-up.",
    outcomes: "Published outcome metrics and board-certified clinical leads.",
    photo: "/images/orthopedics.webp",
    proceduresText: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpec.name.trim()) return alert("Please provide a name.");
    const slug = newSpec.slug.trim() || newSpec.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const procedures = newSpec.proceduresText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    await addSpecialty({
      ...newSpec,
      slug,
      procedures: procedures.length ? procedures : ["Primary Consultation & Evaluation"],
    });

    setIsAdding(false);
    setNewSpec({
      name: "",
      slug: "",
      category: "",
      tagline: "",
      travelDays: "Stay 3–8 days (Procedure dependent)",
      summary: "",
      overview: "",
      recovery: "In-hospital mobilization with structured outpatient physiotherapy and remote follow-up.",
      outcomes: "Published outcome metrics and board-certified clinical leads.",
      photo: "/images/orthopedics.webp",
      proceduresText: "",
    });
  };

  const filtered = resolvedSpecialties.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-paper p-6 shadow-panel">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">Surgeries &amp; Specialties</h2>
          <p className="mt-1 text-sm text-ink/65">
            Add new medical specialties, edit existing surgery details, and update periods of stay.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search specialties…"
            className="rounded-sm border border-line bg-white/60 px-3 py-2 text-xs text-ink placeholder:text-ink/40 focus:border-ink outline-none"
          />
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded-sm bg-signal px-4 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-signal-deep transition-colors"
          >
            {isAdding ? "Cancel" : "➕ Add Specialty / Surgery"}
          </button>
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border-2 border-signal/40 bg-paper p-6 shadow-panel space-y-4 animate-in fade-in"
        >
          <div className="border-b border-line pb-3">
            <h3 className="font-display text-xl font-medium text-ink">Add New Specialty or Surgery Category</h3>
            <p className="text-xs text-ink/60">This will be inserted directly into the live PostgreSQL database.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Specialty / Surgery Name *</span>
              <input
                required
                value={newSpec.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewSpec((prev) => ({
                    ...prev,
                    name: val,
                    slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  }));
                }}
                placeholder="e.g. Cardiothoracic Surgery"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Category *</span>
              <input
                required
                value={newSpec.category}
                onChange={(e) => setNewSpec({ ...newSpec, category: e.target.value })}
                placeholder="e.g. Cardiology"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">URL Slug *</span>
              <input
                required
                value={newSpec.slug}
                onChange={(e) => setNewSpec({ ...newSpec, slug: e.target.value })}
                placeholder="e.g. cardiothoracic"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink font-mono"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Tagline</span>
              <input
                value={newSpec.tagline}
                onChange={(e) => setNewSpec({ ...newSpec, tagline: e.target.value })}
                placeholder="e.g. Minimally invasive bypass and valve repair"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Period of Stay</span>
              <input
                value={newSpec.travelDays}
                onChange={(e) => setNewSpec({ ...newSpec, travelDays: e.target.value })}
                placeholder="e.g. Stay 5–10 days (Procedure dependent)"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Summary (shown on cards)</span>
              <textarea
                rows={2}
                value={newSpec.summary}
                onChange={(e) => setNewSpec({ ...newSpec, summary: e.target.value })}
                placeholder="Short description for specialty cards..."
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Photo Image URL</span>
              <input
                value={newSpec.photo}
                onChange={(e) => setNewSpec({ ...newSpec, photo: e.target.value })}
                placeholder="/images/orthopedics.webp"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink font-mono"
              />
            </label>
          </div>

          <label className="block">
            <span className="font-mono text-[11px] uppercase text-ink/60">
              Surgeries &amp; Procedures List (One surgery per line, format: Surgery Name · X Days)
            </span>
            <textarea
              rows={4}
              value={newSpec.proceduresText}
              onChange={(e) => setNewSpec({ ...newSpec, proceduresText: e.target.value })}
              placeholder={"Coronary Artery Bypass Graft (CABG) · 7–10 Days\nHeart Valve Replacement · 6–8 Days\nAngioplasty & Stenting · 2–3 Days"}
              className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink font-mono"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-sm border border-line px-4 py-2 text-xs font-mono uppercase text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingAction === "addSpecialty"}
              className="rounded-sm bg-signal px-5 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-signal-deep"
            >
              {loadingAction === "addSpecialty" ? "Saving to Database…" : "Save Specialty to Database"}
            </button>
          </div>
        </form>
      )}

      {/* Specialties List */}
      <div className="space-y-5">
        {filtered.map((s) => (
          <SpecialtyRowItem
            key={s.slug}
            specialty={s}
            isEditing={editingSlug === s.slug}
            onToggleEdit={() => setEditingSlug(editingSlug === s.slug ? null : s.slug)}
            onUpdate={updateSpecialty}
            onDelete={deleteSpecialty}
            loading={loadingAction?.includes(s.slug) || false}
          />
        ))}
      </div>
    </div>
  );
}

function SpecialtyRowItem({
  specialty: s,
  isEditing,
  onToggleEdit,
  onUpdate,
  onDelete,
  loading,
}: {
  specialty: any;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (slug: string, patch: any) => Promise<any>;
  onDelete: (slug: string) => Promise<any>;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: s.name,
    category: s.category,
    tagline: s.tagline || "",
    travelDays: s.travelDays || "",
    summary: s.summary || "",
    overview: s.overview || "",
    recovery: s.recovery || "",
    outcomes: s.outcomes || "",
    photo: s.photo || "",
  });

  const [procedures, setProcedures] = useState<string[]>(
    Array.isArray(s.procedures) ? s.procedures : []
  );
  const [newProcName, setNewProcName] = useState("");
  const [newProcDays, setNewProcDays] = useState("");

  const handleSaveAll = async () => {
    await onUpdate(s.slug, {
      ...form,
      procedures,
    });
    onToggleEdit();
  };

  const addProcedure = () => {
    if (!newProcName.trim()) return;
    const item = newProcDays.trim() ? `${newProcName.trim()} · ${newProcDays.trim()}` : newProcName.trim();
    setProcedures([...procedures, item]);
    setNewProcName("");
    setNewProcDays("");
  };

  const removeProcedure = (idx: number) => {
    setProcedures(procedures.filter((_, i) => i !== idx));
  };

  const updateProcedure = (idx: number, val: string) => {
    const next = [...procedures];
    next[idx] = val;
    setProcedures(next);
  };

  return (
    <div className="rounded-lg border border-line bg-paper shadow-panel overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {s.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.photo}
                alt=""
                className="h-16 w-20 rounded-md border border-line object-cover shrink-0"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold">
                  {s.category}
                </span>
                <span className="text-ink/30">·</span>
                <span className="font-mono text-xs text-ink/50">{procedures.length} procedures</span>
              </div>
              <h3 className="mt-1 font-display text-2xl font-medium text-ink">{s.name}</h3>
              <p className="mt-1 text-xs text-ink/60">{s.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/specialties/${s.slug}`}
              target="_blank"
              className="rounded-sm border border-line px-3 py-1.5 text-xs font-mono uppercase text-ink/70 hover:border-ink hover:text-ink"
            >
              View live ↗
            </Link>
            <button
              onClick={onToggleEdit}
              className="rounded-sm border border-ink/20 px-3 py-1.5 text-xs font-mono uppercase font-medium text-ink hover:bg-paper-deep"
            >
              {isEditing ? "Close" : "Edit details & surgeries"}
            </button>
            <button
              onClick={() => onDelete(s.slug)}
              disabled={loading}
              className="rounded-sm border border-signal/30 px-3 py-1.5 text-xs font-mono uppercase text-signal hover:bg-signal/10"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Procedures summary pills */}
        {!isEditing && procedures.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-line/60">
            {procedures.slice(0, 8).map((p, i) => (
              <span
                key={i}
                className="rounded-full bg-paper-deep/70 px-2.5 py-1 text-xs text-ink/80 border border-line/50"
              >
                {p}
              </span>
            ))}
            {procedures.length > 8 && (
              <span className="rounded-full bg-paper-deep/40 px-2.5 py-1 text-xs text-ink/50">
                +{procedures.length - 8} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Inline Full Editor */}
      {isEditing && (
        <div className="border-t border-line bg-paper-deep/30 p-6 space-y-5 animate-in fade-in">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Display Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Category</span>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Period of Stay</span>
              <input
                value={form.travelDays}
                onChange={(e) => setForm({ ...form, travelDays: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Tagline</span>
              <input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Photo Image URL</span>
              <input
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink font-mono"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Card Summary</span>
              <textarea
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Detailed Overview</span>
              <textarea
                rows={2}
                value={form.overview}
                onChange={(e) => setForm({ ...form, overview: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
          </div>

          {/* Surgeries / Procedures Manager */}
          <div className="rounded-lg border border-line bg-paper p-5">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <h4 className="font-display text-lg font-medium text-ink">
                  Surgeries &amp; Procedures in this Specialty
                </h4>
                <p className="text-xs text-ink/60">Add, change, or remove individual operations and stay estimates.</p>
              </div>
              <span className="font-mono text-xs text-signal font-semibold">
                {procedures.length} surgeries listed
              </span>
            </div>

            {/* Existing list */}
            <div className="mt-4 max-h-64 overflow-y-auto space-y-2 pr-1">
              {procedures.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={p}
                    onChange={(e) => updateProcedure(idx, e.target.value)}
                    className="flex-1 rounded-sm border border-line bg-white/80 px-3 py-1.5 text-xs text-ink font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeProcedure(idx)}
                    className="rounded-sm border border-signal/30 px-2 py-1.5 text-xs text-signal hover:bg-signal/10"
                    title="Remove surgery"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add new procedure */}
            <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center gap-2">
              <input
                value={newProcName}
                onChange={(e) => setNewProcName(e.target.value)}
                placeholder="Surgery / Procedure name (e.g. Total Hip Replacement)"
                className="flex-1 min-w-[200px] rounded-sm border border-line bg-white/80 px-3 py-1.5 text-xs text-ink"
              />
              <input
                value={newProcDays}
                onChange={(e) => setNewProcDays(e.target.value)}
                placeholder="Stay period (e.g. 6–8 Days)"
                className="w-40 rounded-sm border border-line bg-white/80 px-3 py-1.5 text-xs text-ink"
              />
              <button
                type="button"
                onClick={addProcedure}
                className="rounded-sm bg-ink px-3 py-1.5 text-xs font-mono uppercase text-paper hover:bg-ink-soft"
              >
                + Add Surgery
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onToggleEdit}
              className="rounded-sm border border-line px-4 py-2 text-xs font-mono uppercase text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={loading}
              className="rounded-sm bg-signal px-5 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-signal-deep"
            >
              {loading ? "Updating in Database…" : "Save All Changes to Database"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 2. PACKAGES & PRICING MANAGER
// -------------------------------------------------------------
function PackagesEditor() {
  const {
    resolvedPackages,
    resolvedSpecialties,
    addPackage,
    updatePackage,
    deletePackage,
    loadingAction,
  } = useAdminContent();

  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // New Package Form
  const [newPkg, setNewPkg] = useState({
    name: "",
    slug: "",
    specialtyId: resolvedSpecialties[0]?.id || "",
    country: "India",
    city: "Bangalore",
    price: "4,500",
    currency: "AUD",
    days: 7,
    summary: "",
    includesText: "Pre-op consultations & bloodwork\nSurgical procedure & implant fees\n5 nights private hospital recovery suite\nAirport and clinical transfers\nDedicated bilingual clinical case manager",
    notes: "Requires recent imaging / clinical history prior to arrival confirmation.",
    photo: "/images/service-doctor.png",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkg.name.trim()) return alert("Please provide a package name.");
    const slug = newPkg.slug.trim() || newPkg.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const includes = newPkg.includesText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    await addPackage({
      ...newPkg,
      slug,
      specialtyId: newPkg.specialtyId || resolvedSpecialties[0]?.id,
      includes,
    });

    setIsAdding(false);
  };

  const filtered = resolvedPackages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-paper p-6 shadow-panel">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">Packages &amp; Pricing</h2>
          <p className="mt-1 text-sm text-ink/65">
            Modify surgery package pricing, currencies, duration, country locations, and inclusions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packages…"
            className="rounded-sm border border-line bg-white/60 px-3 py-2 text-xs text-ink placeholder:text-ink/40 focus:border-ink outline-none"
          />
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded-sm bg-signal px-4 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-signal-deep transition-colors"
          >
            {isAdding ? "Cancel" : "➕ Add Care Package"}
          </button>
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border-2 border-signal/40 bg-paper p-6 shadow-panel space-y-4 animate-in fade-in"
        >
          <div className="border-b border-line pb-3">
            <h3 className="font-display text-xl font-medium text-ink">Create New Surgical Travel Package</h3>
            <p className="text-xs text-ink/60">Configure pricing, days of stay, and bundled clinical services.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Package Name *</span>
              <input
                required
                value={newPkg.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewPkg((prev) => ({
                    ...prev,
                    name: val,
                    slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  }));
                }}
                placeholder="e.g. Total Hip Replacement & Rehab"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">URL Slug *</span>
              <input
                required
                value={newPkg.slug}
                onChange={(e) => setNewPkg({ ...newPkg, slug: e.target.value })}
                placeholder="e.g. total-hip-replacement"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink font-mono"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Specialty *</span>
              <select
                value={newPkg.specialtyId}
                onChange={(e) => setNewPkg({ ...newPkg, specialtyId: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              >
                {resolvedSpecialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Price *</span>
              <input
                required
                value={newPkg.price}
                onChange={(e) => setNewPkg({ ...newPkg, price: e.target.value })}
                placeholder="e.g. 5,200 or 5200"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink font-semibold"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Currency *</span>
              <select
                value={newPkg.currency}
                onChange={(e) => setNewPkg({ ...newPkg, currency: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              >
                <option value="AUD">AUD ($)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="NZD">NZD ($)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Stay Duration (Days) *</span>
              <input
                type="number"
                min="1"
                required
                value={newPkg.days}
                onChange={(e) => setNewPkg({ ...newPkg, days: parseInt(e.target.value) || 1 })}
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Destination Country</span>
              <input
                value={newPkg.country}
                onChange={(e) => setNewPkg({ ...newPkg, country: e.target.value })}
                placeholder="e.g. India"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Destination City</span>
              <input
                value={newPkg.city}
                onChange={(e) => setNewPkg({ ...newPkg, city: e.target.value })}
                placeholder="e.g. Bangalore"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Photo Image URL</span>
              <input
                value={newPkg.photo}
                onChange={(e) => setNewPkg({ ...newPkg, photo: e.target.value })}
                placeholder="/images/orthopedics.webp"
                className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink font-mono"
              />
            </label>
          </div>

          <label className="block">
            <span className="font-mono text-[11px] uppercase text-ink/60">Summary (Package Card Description)</span>
            <textarea
              rows={2}
              value={newPkg.summary}
              onChange={(e) => setNewPkg({ ...newPkg, summary: e.target.value })}
              placeholder="What does this package coordinate and provide?"
              className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink"
            />
          </label>

          <label className="block">
            <span className="font-mono text-[11px] uppercase text-ink/60">
              What&apos;s Included (One item per line)
            </span>
            <textarea
              rows={4}
              value={newPkg.includesText}
              onChange={(e) => setNewPkg({ ...newPkg, includesText: e.target.value })}
              className="mt-1 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink font-mono"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-sm border border-line px-4 py-2 text-xs font-mono uppercase text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingAction === "addPackage"}
              className="rounded-sm bg-signal px-5 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-signal-deep"
            >
              {loadingAction === "addPackage" ? "Creating Package…" : "Create Package in Database"}
            </button>
          </div>
        </form>
      )}

      {/* Package Items */}
      <div className="space-y-5">
        {filtered.map((p) => (
          <PackageRowItem
            key={p.slug}
            pkg={p}
            specialties={resolvedSpecialties}
            isEditing={editingSlug === p.slug}
            onToggleEdit={() => setEditingSlug(editingSlug === p.slug ? null : p.slug)}
            onUpdate={updatePackage}
            onDelete={deletePackage}
            loading={loadingAction?.includes(p.slug) || false}
          />
        ))}
      </div>
    </div>
  );
}

function PackageRowItem({
  pkg: p,
  specialties,
  isEditing,
  onToggleEdit,
  onUpdate,
  onDelete,
  loading,
}: {
  pkg: any;
  specialties: any[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (slug: string, patch: any) => Promise<any>;
  onDelete: (slug: string) => Promise<any>;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: p.name,
    country: p.country,
    city: p.city,
    price: p.price,
    currency: p.currency || "AUD",
    days: p.days,
    specialtyId: p.specialtyId,
    summary: p.summary || "",
    notes: p.notes || "",
    photo: p.photo || "",
  });

  const [includes, setIncludes] = useState<string[]>(
    Array.isArray(p.includes) ? p.includes : []
  );
  const [newInc, setNewInc] = useState("");

  const handleSaveAll = async () => {
    await onUpdate(p.slug, {
      ...form,
      days: Number(form.days),
      includes,
    });
    onToggleEdit();
  };

  const addInclude = () => {
    if (!newInc.trim()) return;
    setIncludes([...includes, newInc.trim()]);
    setNewInc("");
  };

  const removeInclude = (idx: number) => {
    setIncludes(includes.filter((_, i) => i !== idx));
  };

  return (
    <div className="rounded-lg border border-line bg-paper shadow-panel overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {p.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.photo}
                alt=""
                className="h-16 w-20 rounded-md border border-line object-cover shrink-0"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold">
                  {p.specialty || p.specialtyId}
                </span>
                <span className="text-ink/30">·</span>
                <span className="font-mono text-xs text-ink/60">
                  {p.city}, {p.country} ({p.days} Days)
                </span>
              </div>
              <h3 className="mt-1 font-display text-2xl font-medium text-ink">{p.name}</h3>
              <p className="mt-1 text-xs text-ink/65 max-w-xl">{p.summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block font-mono text-[10px] uppercase text-ink/40">Price</span>
              <span className="font-display text-2xl font-medium text-signal">
                {p.currency} {p.price}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/packages/${p.slug}`}
                target="_blank"
                className="rounded-sm border border-line px-3 py-1.5 text-xs font-mono uppercase text-ink/70 hover:border-ink hover:text-ink"
              >
                View live ↗
              </Link>
              <button
                onClick={onToggleEdit}
                className="rounded-sm border border-ink/20 px-3 py-1.5 text-xs font-mono uppercase font-medium text-ink hover:bg-paper-deep"
              >
                {isEditing ? "Close" : "Edit pricing & details"}
              </button>
              <button
                onClick={() => onDelete(p.slug)}
                disabled={loading}
                className="rounded-sm border border-signal/30 px-3 py-1.5 text-xs font-mono uppercase text-signal hover:bg-signal/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editing Drawer */}
      {isEditing && (
        <div className="border-t border-line bg-paper-deep/30 p-6 space-y-5 animate-in fade-in">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block">
                <span className="font-mono text-[11px] uppercase text-ink/60">Package Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
                />
              </label>
            </div>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-signal font-semibold">Price (Numeric or String)</span>
              <input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1 w-full rounded-sm border border-signal/40 bg-white/90 px-3 py-2 text-sm font-display font-medium text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Currency</span>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              >
                <option value="AUD">AUD ($)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="NZD">NZD ($)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Stay (Days)</span>
              <input
                type="number"
                value={form.days}
                onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) || 1 })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">City</span>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Country</span>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Specialty Relation</span>
              <select
                value={form.specialtyId}
                onChange={(e) => setForm({ ...form, specialtyId: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              >
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Summary</span>
              <textarea
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Photo Image URL</span>
              <input
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink font-mono"
              />
            </label>
          </div>

          {/* Inclusions manager */}
          <div className="rounded-lg border border-line bg-paper p-5">
            <h4 className="font-display text-lg font-medium text-ink">Package Inclusions</h4>
            <div className="mt-3 space-y-2">
              {includes.map((inc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={inc}
                    onChange={(e) => {
                      const next = [...includes];
                      next[i] = e.target.value;
                      setIncludes(next);
                    }}
                    className="flex-1 rounded-sm border border-line bg-white/80 px-3 py-1.5 text-xs text-ink"
                  />
                  <button
                    type="button"
                    onClick={() => removeInclude(i)}
                    className="rounded-sm border border-signal/30 px-2 py-1.5 text-xs text-signal hover:bg-signal/10"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={newInc}
                onChange={(e) => setNewInc(e.target.value)}
                placeholder="Add new inclusion (e.g. Airport VIP transfer)"
                className="flex-1 rounded-sm border border-line bg-white/80 px-3 py-1.5 text-xs text-ink"
              />
              <button
                type="button"
                onClick={addInclude}
                className="rounded-sm bg-ink px-3 py-1.5 text-xs font-mono uppercase text-paper hover:bg-ink-soft"
              >
                + Add Item
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onToggleEdit}
              className="rounded-sm border border-line px-4 py-2 text-xs font-mono uppercase text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={loading}
              className="rounded-sm bg-signal px-5 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-signal-deep"
            >
              {loading ? "Updating Package…" : "Save Package Changes to Database"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 3. SITE COPY & HERO BRAND
// -------------------------------------------------------------
function SiteCopyEditor() {
  const { overrides, updateOverride } = useAdminContent();
  const landing = overrides.landing?.home || {};
  const site = overrides.site?.global || {};

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-4">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">Hero Section Headlines</h2>
          <p className="text-sm text-ink/65">Edit the top banner, primary titles, and intro narrative on the homepage.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[11px] uppercase text-ink/60">Hero Badge Tagline</span>
            <input
              value={landing.heroBadge ?? "MedicalCare Beyond Borders"}
              onChange={(e) => updateOverride("landing", "home", "heroBadge", e.target.value)}
              className="mt-1 w-full rounded-sm border border-line bg-white/60 px-3 py-2 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[11px] uppercase text-ink/60">Eyebrow Brand Lead</span>
            <input
              value={landing.eyebrow ?? "MedyCare 2₹ism · Healthcare & Medical Tourism"}
              onChange={(e) => updateOverride("landing", "home", "eyebrow", e.target.value)}
              className="mt-1 w-full rounded-sm border border-line bg-white/60 px-3 py-2 text-sm text-ink"
            />
          </label>
        </div>

        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Hero Main Title</span>
          <input
            value={landing.heroTitle ?? "MedicalCare Beyond Borders"}
            onChange={(e) => updateOverride("landing", "home", "heroTitle", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/60 px-3 py-2 text-base font-display font-medium text-ink"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Hero Subtitle Paragraph</span>
          <textarea
            rows={3}
            value={
              landing.heroSubtitle ??
              "MedyCare 2₹ism connects patients with leading accredited hospitals across borders. Clear clinical paths, documented pricing, and a single coordinator from first review through full recovery."
            }
            onChange={(e) => updateOverride("landing", "home", "heroSubtitle", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/60 px-3 py-2 text-sm text-ink"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Animated Intro Narrative</span>
          <textarea
            rows={3}
            value={
              landing.scrambledText ??
              "From the first message to your final follow-up, the same person holds the thread. Records move with you. Decisions are documented. Nothing about your care is left to chance or to a call center."
            }
            onChange={(e) => updateOverride("landing", "home", "scrambledText", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/60 px-3 py-2 text-sm text-ink"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Pressure Banner Text</span>
          <input
            value={landing.pressureText ?? "MedicalCare Beyond Borders"}
            onChange={(e) => updateOverride("landing", "home", "pressureText", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/60 px-3 py-2 text-sm text-ink font-display"
          />
        </label>
      </div>

      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-4">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">&ldquo;Why MedyCare&rdquo; Section</h2>
          <p className="text-sm text-ink/65">Headline and summary for the value propositions block.</p>
        </div>

        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Section Title</span>
          <input
            value={landing.whyTitle ?? "Why MedyCare 2₹ism"}
            onChange={(e) => updateOverride("landing", "home", "whyTitle", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/60 px-3 py-2 text-sm text-ink font-medium"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Section Description</span>
          <textarea
            rows={2}
            value={
              landing.whyBody ??
              "We refuse the crowded medical-travel template. This is healthcare delivering coordinated care — calm, documented, and accountable beyond borders."
            }
            onChange={(e) => updateOverride("landing", "home", "whyBody", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/60 px-3 py-2 text-sm text-ink"
          />
        </label>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. METRICS & TRUST BADGES
// -------------------------------------------------------------
function StatsEditor() {
  const { resolvedStats, updateStats, resolvedTrust, updateTrust } = useAdminContent();
  const [statsList, setStatsList] = useState<StatItem[]>(resolvedStats);
  const [trustList, setTrustList] = useState<string[]>(resolvedTrust);
  const [newTrust, setNewTrust] = useState("");

  const saveStats = async () => {
    await updateStats(statsList);
    alert("Stats updated live!");
  };

  const saveTrust = async (next: string[]) => {
    setTrustList(next);
    await updateTrust(next);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 className="font-display text-2xl font-medium text-ink">Key Performance Metrics</h2>
            <p className="text-sm text-ink/65">The 4 counters animated on the homepage dark band.</p>
          </div>
          <button
            onClick={saveStats}
            className="rounded-sm bg-signal px-4 py-2 text-xs font-mono uppercase text-white hover:bg-signal-deep"
          >
            Save Metrics
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsList.map((stat, i) => (
            <div key={i} className="rounded-lg border border-line bg-white/40 p-4 space-y-2">
              <span className="font-mono text-[10px] uppercase text-ink/40">Stat #{i + 1}</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={stat.v}
                  onChange={(e) => {
                    const next = [...statsList];
                    next[i].v = parseInt(e.target.value) || 0;
                    setStatsList(next);
                  }}
                  className="w-20 rounded-sm border border-line bg-white px-2 py-1 text-lg font-display font-medium text-ink"
                />
                <input
                  value={stat.s}
                  onChange={(e) => {
                    const next = [...statsList];
                    next[i].s = e.target.value;
                    setStatsList(next);
                  }}
                  placeholder="Suffix (e.g. + or %)"
                  className="w-16 rounded-sm border border-line bg-white px-2 py-1 text-lg font-display text-signal"
                />
              </div>
              <input
                value={stat.l}
                onChange={(e) => {
                  const next = [...statsList];
                  next[i].l = e.target.value;
                  setStatsList(next);
                }}
                className="w-full rounded-sm border border-line bg-white px-2 py-1 text-xs text-ink"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-4">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">Trust Badges Marquee</h2>
          <p className="text-sm text-ink/65">Items continuously scrolling across the homepage banner.</p>
        </div>

        <div className="space-y-2">
          {trustList.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={t}
                onChange={(e) => {
                  const next = [...trustList];
                  next[idx] = e.target.value;
                  saveTrust(next);
                }}
                className="flex-1 rounded-sm border border-line bg-white/70 px-3 py-1.5 text-xs text-ink font-mono"
              />
              <button
                type="button"
                onClick={() => saveTrust(trustList.filter((_, i) => i !== idx))}
                className="rounded-sm border border-signal/30 px-2 py-1.5 text-xs text-signal hover:bg-signal/10"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            value={newTrust}
            onChange={(e) => setNewTrust(e.target.value)}
            placeholder="Add new accreditation or trust point (e.g. NABH Certified Centers)"
            className="flex-1 rounded-sm border border-line bg-white/70 px-3 py-1.5 text-xs text-ink"
          />
          <button
            type="button"
            onClick={() => {
              if (!newTrust.trim()) return;
              saveTrust([...trustList, newTrust.trim()]);
              setNewTrust("");
            }}
            className="rounded-sm bg-ink px-4 py-1.5 text-xs font-mono uppercase text-paper hover:bg-ink-soft"
          >
            + Add Badge
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. PATIENT JOURNEY TIMELINE
// -------------------------------------------------------------
function JourneyEditor() {
  const { resolvedJourney, updateJourney } = useAdminContent();
  const [phases, setPhases] = useState<JourneyPhaseItem[]>(resolvedJourney);

  const savePhases = async () => {
    await updateJourney(phases);
    alert("Patient Journey timeline updated live!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-line bg-paper p-6 shadow-panel">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">Patient Journey Timeline</h2>
          <p className="mt-1 text-sm text-ink/65">
            Configure the 3 core phases of clinical medical travel and their checklist milestones.
          </p>
        </div>
        <button
          onClick={savePhases}
          className="rounded-sm bg-signal px-5 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-signal-deep"
        >
          Save All Phases
        </button>
      </div>

      <div className="space-y-6">
        {phases.map((phase, pIdx) => (
          <div key={phase.id} className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-4">
            <div className="flex items-center gap-2 border-b border-line pb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold">
                Phase {phase.id}
              </span>
            </div>

            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Phase Title</span>
              <input
                value={phase.name}
                onChange={(e) => {
                  const next = [...phases];
                  next[pIdx].name = e.target.value;
                  setPhases(next);
                }}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink font-medium"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[11px] uppercase text-ink/60">Focus &amp; Overview</span>
              <textarea
                rows={3}
                value={phase.focus}
                onChange={(e) => {
                  const next = [...phases];
                  next[pIdx].focus = e.target.value;
                  setPhases(next);
                }}
                className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
              />
            </label>

            <div>
              <span className="block font-mono text-[11px] uppercase text-ink/60 mb-2">Checklist Milestones</span>
              <div className="space-y-2">
                {phase.actions.map((act, actIdx) => (
                  <div key={actIdx} className="flex items-center gap-2">
                    <input
                      value={act}
                      onChange={(e) => {
                        const next = [...phases];
                        next[pIdx].actions[actIdx] = e.target.value;
                        setPhases(next);
                      }}
                      className="flex-1 rounded-sm border border-line bg-white/70 px-3 py-1.5 text-xs text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...phases];
                        next[pIdx].actions = next[pIdx].actions.filter((_, i) => i !== actIdx);
                        setPhases(next);
                      }}
                      className="rounded-sm border border-signal/30 px-2 py-1.5 text-xs text-signal hover:bg-signal/10"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = [...phases];
                  next[pIdx].actions.push("New coordinated milestone");
                  setPhases(next);
                }}
                className="mt-2 text-xs font-mono uppercase text-ink/65 hover:text-ink underline"
              >
                + Add Milestone
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. PATIENT STORIES / TESTIMONIALS
// -------------------------------------------------------------
function TestimonialsEditor() {
  const { resolvedTestimonials, updateTestimonials } = useAdminContent();
  const [list, setList] = useState<TestimonialItem[]>(resolvedTestimonials);
  const [newQuote, setNewQuote] = useState({ quote: "", name: "", care: "" });

  const save = async (next: TestimonialItem[]) => {
    setList(next);
    await updateTestimonials(next);
  };

  const add = () => {
    if (!newQuote.quote.trim() || !newQuote.name.trim()) return alert("Fill in quote and patient name.");
    save([...list, newQuote]);
    setNewQuote({ quote: "", name: "", care: "" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel">
        <h2 className="font-display text-2xl font-medium text-ink">Patient Stories &amp; Testimonials</h2>
        <p className="mt-1 text-sm text-ink/65">Add, edit, or remove patient quotes displayed across the platform.</p>
      </div>

      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-3">
        <h3 className="font-display text-lg font-medium text-ink">Add New Patient Review</h3>
        <textarea
          rows={2}
          value={newQuote.quote}
          onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })}
          placeholder="“The difference was having one dedicated coordinator who held the entire thread…”"
          className="w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={newQuote.name}
            onChange={(e) => setNewQuote({ ...newQuote, name: e.target.value })}
            placeholder="Patient Name (e.g. Sarah M., Sydney AU)"
            className="rounded-sm border border-line bg-white/70 px-3 py-2 text-xs text-ink"
          />
          <input
            value={newQuote.care}
            onChange={(e) => setNewQuote({ ...newQuote, care: e.target.value })}
            placeholder="Procedure / Treatment (e.g. Total Hip Arthroplasty)"
            className="rounded-sm border border-line bg-white/70 px-3 py-2 text-xs text-ink"
          />
        </div>
        <button
          onClick={add}
          className="rounded-sm bg-signal px-4 py-2 text-xs font-mono uppercase text-white hover:bg-signal-deep"
        >
          + Add Testimonial
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-line bg-paper p-5 shadow-panel space-y-3">
            <textarea
              rows={3}
              value={item.quote}
              onChange={(e) => {
                const next = [...list];
                next[idx].quote = e.target.value;
                save(next);
              }}
              className="w-full rounded-sm border border-line bg-white/60 p-2 text-xs text-ink"
            />
            <input
              value={item.name}
              onChange={(e) => {
                const next = [...list];
                next[idx].name = e.target.value;
                save(next);
              }}
              className="w-full rounded-sm border border-line bg-white/60 px-2 py-1 text-xs text-ink font-medium"
            />
            <input
              value={item.care}
              onChange={(e) => {
                const next = [...list];
                next[idx].care = e.target.value;
                save(next);
              }}
              className="w-full rounded-sm border border-line bg-white/60 px-2 py-1 text-xs text-signal"
            />
            <button
              onClick={() => save(list.filter((_, i) => i !== idx))}
              className="font-mono text-[10px] uppercase text-signal hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 7. FREQUENTLY ASKED QUESTIONS (FAQS)
// -------------------------------------------------------------
function FaqsEditor() {
  const { resolvedFaqs, updateFaqs } = useAdminContent();
  const [faqs, setFaqs] = useState<FaqItem[]>(resolvedFaqs);
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });

  const save = async (next: FaqItem[]) => {
    setFaqs(next);
    await updateFaqs(next);
  };

  const add = () => {
    if (!newFaq.q.trim() || !newFaq.a.trim()) return alert("Fill in both question and answer.");
    save([...faqs, newFaq]);
    setNewFaq({ q: "", a: "" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel">
        <h2 className="font-display text-2xl font-medium text-ink">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-ink/65">
          Controls the questions and clinical advice answers appearing on the homepage and `/faq`.
        </p>
      </div>

      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-3">
        <h3 className="font-display text-lg font-medium text-ink">Add New Question</h3>
        <input
          value={newFaq.q}
          onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
          placeholder="Question (e.g. Can I fly home right after surgery?)"
          className="w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink font-medium"
        />
        <textarea
          rows={3}
          value={newFaq.a}
          onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
          placeholder="Answer explanation..."
          className="w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
        />
        <button
          onClick={add}
          className="rounded-sm bg-signal px-4 py-2 text-xs font-mono uppercase text-white hover:bg-signal-deep"
        >
          + Add FAQ Item
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div key={idx} className="rounded-lg border border-line bg-paper p-5 shadow-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-ink/40">FAQ #{idx + 1}</span>
              <button
                onClick={() => save(faqs.filter((_, i) => i !== idx))}
                className="font-mono text-xs uppercase text-signal hover:underline"
              >
                Delete
              </button>
            </div>
            <input
              value={f.q}
              onChange={(e) => {
                const next = [...faqs];
                next[idx].q = e.target.value;
                save(next);
              }}
              className="w-full rounded-sm border border-line bg-white/70 px-3 py-1.5 text-sm text-ink font-medium"
            />
            <textarea
              rows={2}
              value={f.a}
              onChange={(e) => {
                const next = [...faqs];
                next[idx].a = e.target.value;
                save(next);
              }}
              className="w-full rounded-sm border border-line bg-white/70 px-3 py-1.5 text-xs text-ink/80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 8. JOURNAL / BLOG
// -------------------------------------------------------------
function JournalEditor() {
  const { resolvedPosts, addPost, updatePost, deletePost } = useAdminContent();
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState<PostItem>({
    slug: "",
    category: "Preparation",
    title: "",
    excerpt: "",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: "4 min read",
    photo: "/images/service-doctor.png",
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim()) return;
    const slug = newPost.slug.trim() || newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await addPost({ ...newPost, slug });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-line bg-paper p-6 shadow-panel">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">Journal &amp; Medical Guides</h2>
          <p className="mt-1 text-sm text-ink/65">Publish and edit healthcare travel guides and recovery notes.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-sm bg-signal px-4 py-2 text-xs font-mono uppercase text-white hover:bg-signal-deep"
        >
          {isAdding ? "Cancel" : "➕ Write Article"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="rounded-lg border border-signal/40 bg-paper p-6 shadow-panel space-y-4">
          <h3 className="font-display text-xl font-medium text-ink">Write New Medical Guide</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              required
              placeholder="Article Title"
              value={newPost.title}
              onChange={(e) => {
                const val = e.target.value;
                setNewPost((prev) => ({
                  ...prev,
                  title: val,
                  slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                }));
              }}
              className="rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
            />
            <input
              required
              placeholder="Slug"
              value={newPost.slug}
              onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
              className="rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink font-mono"
            />
            <input
              placeholder="Category"
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Article Excerpt..."
            value={newPost.excerpt}
            onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
            className="w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
          />
          <button
            type="submit"
            className="rounded-sm bg-signal px-5 py-2 text-xs font-mono uppercase text-white"
          >
            Publish Article
          </button>
        </form>
      )}

      <div className="space-y-4">
        {resolvedPosts.map((p) => (
          <div key={p.slug} className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-signal font-semibold">{p.category}</span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  className="rounded-sm border border-line px-2.5 py-1 text-xs font-mono uppercase text-ink"
                >
                  View live ↗
                </Link>
                <button
                  onClick={() => deletePost(p.slug)}
                  className="rounded-sm border border-signal/30 px-2.5 py-1 text-xs font-mono uppercase text-signal"
                >
                  Delete
                </button>
              </div>
            </div>
            <input
              value={p.title}
              onChange={(e) => updatePost(p.slug, { title: e.target.value })}
              className="w-full rounded-sm border border-line bg-white/70 px-3 py-2 font-display text-xl text-ink"
            />
            <textarea
              rows={2}
              value={p.excerpt}
              onChange={(e) => updatePost(p.slug, { excerpt: e.target.value })}
              className="w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink/70"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 9. CONTACTS & FOOTER
// -------------------------------------------------------------
function FooterEditor() {
  const { overrides, updateOverride } = useAdminContent();
  const site = overrides.site?.global || {};

  return (
    <div className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-4">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Footer &amp; Contact Details</h2>
        <p className="text-sm text-ink/65">Global contact numbers, office location, and legal information.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Company / Brand Name</span>
          <input
            value={site.brandName ?? "MedyCare 2₹ism"}
            onChange={(e) => updateOverride("site", "global", "brandName", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Brand Tagline</span>
          <input
            value={site.brandTagline ?? "MedicalCare Beyond Borders"}
            onChange={(e) => updateOverride("site", "global", "brandTagline", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink font-semibold text-signal"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">Concierge Email</span>
          <input
            value={site.email ?? "concierge@medycare.com"}
            onChange={(e) => updateOverride("site", "global", "email", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase text-ink/60">24/7 Recovery Emergency Line</span>
          <input
            value={site.emergencyPhone ?? "+61 (02) 8000 1234"}
            onChange={(e) => updateOverride("site", "global", "emergencyPhone", e.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink font-mono"
          />
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-[11px] uppercase text-ink/60">Footer Description / Legal Disclaimer</span>
        <textarea
          rows={3}
          value={
            site.footerDisclaimer ??
            "MedyCare 2₹ism — MedicalCare Beyond Borders. A premier medical tourism and healthcare concierge connecting international patients with world-class accredited hospitals, top specialists, and seamless care coordination across borders."
          }
          onChange={(e) => updateOverride("site", "global", "footerDisclaimer", e.target.value)}
          className="mt-1 w-full rounded-sm border border-line bg-white/70 px-3 py-2 text-sm text-ink"
        />
      </label>
    </div>
  );
}

// -------------------------------------------------------------
// 10. PHOTOS / MEDIA LIBRARY
// -------------------------------------------------------------
function PhotosEditor() {
  const { resolvedSpecialties, resolvedPackages, updateSpecialty, updatePackage } = useAdminContent();
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) setUploadedUrl(data.url);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-paper p-6 shadow-panel space-y-4">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">Media &amp; Photo Library</h2>
          <p className="text-sm text-ink/65">Upload high-resolution clinical images to Vercel Blob or local storage.</p>
        </div>

        <div className="flex items-center gap-4">
          <label className="cursor-pointer rounded-sm bg-ink px-4 py-2 text-xs font-mono uppercase text-paper hover:bg-ink-soft">
            {uploading ? "Uploading Image…" : "📁 Upload Image File"}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          {uploadedUrl && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-signal">Uploaded: {uploadedUrl}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(uploadedUrl);
                  alert("Copied image URL to clipboard!");
                }}
                className="rounded-sm border border-line px-2 py-1 text-xs font-mono uppercase text-ink"
              >
                Copy URL
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-paper p-6 shadow-panel">
          <h3 className="font-display text-xl font-medium text-ink mb-4">Specialty Photos</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {resolvedSpecialties.map((s) => (
              <div key={s.slug} className="flex items-center justify-between gap-3 border-b border-line pb-2">
                <span className="text-sm font-medium text-ink truncate">{s.name}</span>
                <input
                  value={s.photo || ""}
                  onChange={(e) => updateSpecialty(s.slug, { photo: e.target.value })}
                  placeholder="/images/photo.webp"
                  className="w-48 rounded-sm border border-line bg-white/70 px-2 py-1 text-xs font-mono text-ink"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper p-6 shadow-panel">
          <h3 className="font-display text-xl font-medium text-ink mb-4">Package Photos</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {resolvedPackages.map((p) => (
              <div key={p.slug} className="flex items-center justify-between gap-3 border-b border-line pb-2">
                <span className="text-sm font-medium text-ink truncate">{p.name}</span>
                <input
                  value={p.photo || ""}
                  onChange={(e) => updatePackage(p.slug, { photo: e.target.value })}
                  placeholder="/images/photo.webp"
                  className="w-48 rounded-sm border border-line bg-white/70 px-2 py-1 text-xs font-mono text-ink"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 11. INQUIRIES INBOX
// -------------------------------------------------------------
function InquiriesInbox() {
  const { inquiries, updateInquiryStatus } = useAdminContent();

  if (inquiries.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-paper p-12 text-center shadow-panel">
        <p className="font-display text-xl font-medium text-ink">No inquiries submitted yet</p>
        <p className="mt-2 text-sm text-ink/55">
          Patient submissions from the &ldquo;Plan your care&rdquo; form will appear in this inbox.
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
                {new Date(i.createdAt).toLocaleString()} · {i.country || "International"}
              </p>
            </div>
            <button
              onClick={() => updateInquiryStatus(i.id, i.status === "new" ? "read" : "new")}
              className={`rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
                i.status === "new"
                  ? "bg-signal/15 text-signal font-semibold"
                  : "bg-paper-deep text-ink/60"
              }`}
            >
              Status: {i.status} (click to toggle)
            </button>
          </div>

          <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">Condition</dt>
              <dd className="text-ink font-medium">{i.condition}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">Requested Procedure</dt>
              <dd className="text-ink">{i.procedure || "To be advised by clinician"}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">Travel Timing</dt>
              <dd className="text-ink">{i.timeline}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">Attached Documents</dt>
              <dd className="text-ink">{Array.isArray(i.files) && i.files.length ? i.files.join(", ") : "None"}</dd>
            </div>
          </dl>

          {i.notes && (
            <p className="mt-3 rounded-sm bg-paper-deep/50 px-3 py-2 text-sm text-ink/75">
              &ldquo;{i.notes}&rdquo;
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// 12. AUDIENCE / SUBSCRIBERS
// -------------------------------------------------------------
function AudiencePanel() {
  const { subscribers, deleteSubscriber } = useAdminContent();

  return (
    <div className="rounded-lg border border-line bg-paper shadow-panel">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <div>
          <h2 className="font-display text-xl font-medium text-ink">Newsletter Subscribers</h2>
          <p className="mt-1 text-sm text-ink/55">Captured emails from the footer newsletter form.</p>
        </div>
        <span className="rounded-sm bg-paper-deep px-3 py-1.5 font-mono text-xs text-ink/70">
          {subscribers.length} total
        </span>
      </div>

      {subscribers.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-ink/55">No subscribers yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {subscribers.map((s) => (
            <li key={s.email} className="flex items-center justify-between gap-4 px-6 py-3.5">
              <span className="truncate text-sm text-ink">{s.email}</span>
              <button
                onClick={() => deleteSubscriber(s.email)}
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

// -------------------------------------------------------------
// 13. ADMIN SECURITY & PASSWORD
// -------------------------------------------------------------
function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function EyeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeOffIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

function SecurityEditor({ onChanged }: { onChanged?: () => void | Promise<void> } = {}) {
  const [accountInfo, setAccountInfo] = useState<{
    username: string;
    isDefault: boolean;
    updatedAt: string | null;
  } | null>(null);

  const [username, setUsername] = useState("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getAdminAccountInfoAction().then((info) => {
      if (mounted) {
        setAccountInfo(info);
        setUsername(info.username);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 10) {
      setError("New password must be at least 10 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await changeAdminPasswordAction({
        currentPassword,
        newPassword,
        newUsername: username,
      });

      if (res.success) {
        setSuccess("Password changed successfully! All other sessions have been signed out.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        const refreshed = await getAdminAccountInfoAction();
        setAccountInfo(refreshed);
        await onChanged?.();
      } else {
        setError(res.error || "Failed to change password.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Status Card */}
      <div className="rounded-lg border border-line bg-paper shadow-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-signal/10 text-signal border border-signal/20">
              <LockIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-medium text-ink">Admin Security &amp; Credentials</h2>
              <p className="text-xs text-ink/60">Manage your administrative login credentials and access password.</p>
            </div>
          </div>
          {accountInfo && (
            <span
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase font-semibold tracking-wider ${
                accountInfo.isDefault
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {accountInfo.isDefault ? "⚠️ Bootstrap Password — Change Required" : "🔒 Custom Password Active"}
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-sm border border-line bg-paper-deep/30 p-3">
            <span className="font-mono uppercase tracking-wider text-ink/50 text-[10px]">Active Username</span>
            <p className="mt-1 font-mono text-sm font-semibold text-ink">{accountInfo?.username || "admin"}</p>
          </div>
          <div className="rounded-sm border border-line bg-paper-deep/30 p-3">
            <span className="font-mono uppercase tracking-wider text-ink/50 text-[10px]">Last Updated</span>
            <p className="mt-1 font-mono text-xs text-ink/75">
              {accountInfo?.updatedAt ? new Date(accountInfo.updatedAt).toLocaleString() : "Never (Default demo)"}
            </p>
          </div>
        </div>

        {accountInfo?.isDefault && (
          <div className="mt-4 rounded-sm border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-900 dark:text-amber-300">
            <strong>Security Recommendation:</strong> You are still using the bootstrap password. Set a strong personal password below to unlock the control panel.
          </div>
        )}
      </div>

      {/* Change Password Form */}
      <div className="rounded-lg border border-line bg-paper shadow-panel p-6">
        <h3 className="font-display text-lg font-medium text-ink">Change Admin Password</h3>
        <p className="mt-1 text-xs text-ink/60">
          Enter your existing password to verify identity, then set your new password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
                Admin Username
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-1.5 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink outline-none focus:border-ink font-mono"
              />
              <span className="mt-1 block text-[11px] text-ink/45">
                You can keep this as &apos;admin&apos; or change to your preferred administrator handle.
              </span>
            </label>
          </div>

          <div>
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
                Current Password
              </span>
              <div className="relative mt-1.5">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full rounded-sm border border-line bg-white/50 px-3 py-2 pr-10 text-sm text-ink outline-none focus:border-ink font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                  aria-label="Toggle password visibility"
                >
                  {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
                  New Password
                </span>
                <div className="relative mt-1.5">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 10 characters"
                    autoComplete="new-password"
                    className="w-full rounded-sm border border-line bg-white/50 px-3 py-2 pr-10 text-sm text-ink outline-none focus:border-ink font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                    aria-label="Toggle password visibility"
                  >
                    {showNew ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </label>
            </div>

            <div>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
                  Confirm New Password
                </span>
                <input
                  type={showNew ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  className="mt-1.5 w-full rounded-sm border border-line bg-white/50 px-3 py-2 text-sm text-ink outline-none focus:border-ink font-mono"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-sm border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs text-signal font-medium">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              ✓ {success}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-sm bg-signal px-6 py-2.5 text-sm font-semibold text-white shadow-panel transition-colors hover:bg-signal-deep disabled:opacity-50"
            >
              {submitting ? "Updating Password…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
