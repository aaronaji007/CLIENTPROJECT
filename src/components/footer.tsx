import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-xl font-medium">Carte Clinique</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/65">
              A global surgery and care concierge. We coordinate the journey from
              discovery to recovery — one point of contact across every border.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/45">
              Concept site — demonstration only
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
              Explore
            </p>
            <ul className="mt-4 space-y-3 text-sm text-paper/80">
              <li><Link href="/specialties" className="hover:text-paper">Specialties</Link></li>
              <li><Link href="/packages" className="hover:text-paper">Packages</Link></li>
              <li><Link href="/blog" className="hover:text-paper">Journal</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
              Care
            </p>
            <ul className="mt-4 space-y-3 text-sm text-paper/80">
              <li><span className="cursor-pointer hover:text-paper">Plan your care</span></li>
              <li><span className="cursor-pointer hover:text-paper">Book a consult</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-paper/15 pt-6 text-xs text-paper/45 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} Carte Clinique. All content is placeholder and synthetic.</p>
          <p className="font-mono">Placeholder / never verified medical claims</p>
        </div>
      </div>
    </footer>
  );
}
