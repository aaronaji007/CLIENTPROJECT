import Link from "next/link";
import { specialties } from "@/lib/data";
import { ArrowIcon } from "./icons";
import { Artwork } from "./artwork";
import { OverrideText } from "./override-text";

export function SpecialtyCard({
  slug,
  category,
  name,
  summary,
}: {
  slug: string;
  category: string;
  name: string;
  summary: string;
}) {
  return (
    <Link
      href={`/specialties/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-panel transition-transform hover:-translate-y-0.5"
    >
      <div className="aspect-[4/3] w-full">
        <Artwork slug={slug} kind="card" label={category} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-medium text-ink">
          <OverrideText kind="specialties" slug={slug} field="name">
            {name}
          </OverrideText>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
          <OverrideText kind="specialties" slug={slug} field="summary">
            {summary}
          </OverrideText>
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 group-hover:underline">
          Explore specialist care
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

export function specialtiesIndex() {
  return specialties;
}
