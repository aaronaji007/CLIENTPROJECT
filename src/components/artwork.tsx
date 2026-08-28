import { specialties, packages } from "@/lib/data";

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function sizeFor(kind: "hero" | "card") {
  const vw = kind === "hero" ? 1440 : 640;
  const vh = kind === "hero" ? 820 : 420;
  return { vw, vh };
}

export function Artwork({
  slug,
  kind = "card",
  label,
}: {
  slug: string;
  kind?: "hero" | "card";
  label?: string;
}) {
  const { vw, vh } = sizeFor(kind);
  const seed = hash(slug);
  const hueA = 190 + (seed % 22);
  const hueB = 205 + ((seed >> 3) % 18);
  const glowX = 20 + (seed % 60);
  const glowY = 15 + ((seed >> 4) % 50);
  const cx = 18 + (seed % 62);
  const cy = 22 + ((seed >> 5) % 46);
  const r1 = 30 + (seed % 40);
  const r2 = 8 + ((seed >> 6) % 16);
  const opacity = kind === "hero" ? 0.55 : 0.75;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `linear-gradient(150deg,
          hsl(${hueB} 55% ${kind === "hero" ? 14 : 22}%),
          hsl(${hueA} 48% ${kind === "hero" ? 9 : 17}%)
        )`,
      }}
      aria-hidden="true"
    >
      {/* x-ray lightbox glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(232,244,240,${opacity}), transparent ${kind === "hero" ? "46%" : "58%"})`,
        }}
      />
      {/* fine grid */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,244,239,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(246,244,239,.5) 1px, transparent 1px)",
          backgroundSize: kind === "hero" ? "46px 46px" : "30px 30px",
        }}
      />
      {/* central motif rings (like a scan/target) */}
      <div
        className="absolute"
        style={{
          left: `${cx}%`,
          top: `${cy}%`,
          width: 0,
          height: 0,
        }}
      >
        {[r1, r1 * 0.72, r2].map((r, i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: r * 2,
              height: r * 2,
              border: `1px solid rgba(246,244,239,${0.5 - i * 0.14})`,
            }}
          />
        ))}
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/80"
          style={{ width: 9, height: 9, boxShadow: "0 0 0 5px rgba(201,79,61,.15)" }}
        />
        {/* crosshair lines */}
        <span className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-paper/30" />
        <span className="absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2 bg-paper/30" />
      </div>
      {/* corner ticks */}
      <CornerTicks kind={kind} />
      {/* mono label */}
      <span
        className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70"
      >
        {label || slug.replace(/-/g, " ")}
      </span>
      <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-[0.18em] text-paper/45">
        {vw}×{vh}
      </span>
    </div>
  );
}

function CornerTicks({ kind }: { kind: "hero" | "card" }) {
  const n = kind === "hero" ? 26 : 18;
  const pad = kind === "hero" ? 22 : 14;
  const color = "rgba(246,244,239,0.55)";
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 100 100`}
      preserveAspectRatio="none"
    >
      {[
        `M ${pad / 16} ${pad / 16} h ${n / 16} M ${pad / 16} ${pad / 16} v ${n / 16}`,
        `M ${100 - pad / 16} ${pad / 16} h ${-n / 16} M ${100 - pad / 16} ${pad / 16} v ${n / 16}`,
        `M ${pad / 16} ${100 - pad / 16} h ${n / 16} M ${pad / 16} ${100 - pad / 16} v ${-n / 16}`,
        `M ${100 - pad / 16} ${100 - pad / 16} h ${-n / 16} M ${100 - pad / 16} ${100 - pad / 16} v ${-n / 16}`,
      ].map((d, i) => (
        <path key={i} d={d} stroke={color} strokeWidth={0.4} fill="none" />
      ))}
    </svg>
  );
}

export function artworkLabelFor(slug: string): string {
  const s = specialties.find((x) => x.slug === slug);
  if (s) return s.category;
  const p = packages.find((x) => x.slug === slug);
  if (p) return p.name;
  return slug.replace(/-/g, " ");
}
