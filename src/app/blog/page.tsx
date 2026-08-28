import Link from "next/link";
import { posts } from "@/lib/data";
import { Artwork } from "@/components/artwork";
import { OverrideText } from "@/components/override-text";

export const metadata = {
  title: "Journal",
  description: "Practical guides on planning and recovering from care abroad.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Notes on care, planned well
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/70">
          Practical writing on the questions that matter when seeking care abroad — how to plan,
          what to ask, and how to recover.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-panel transition-transform hover:-translate-y-0.5 sm:flex-row"
          >
            <div className="sm:w-56 sm:shrink-0">
              <div className="h-44 w-full sm:h-full">
                <Artwork slug={post.slug} kind="card" label={post.category} />
              </div>
            </div>
            <div className="flex-1 p-6">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                <span className="text-signal">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{post.date}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-medium text-ink group-hover:underline">
                <OverrideText kind="posts" slug={post.slug} field="title">
                  {post.title}
                </OverrideText>
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink/65">
                <OverrideText kind="posts" slug={post.slug} field="excerpt">
                  {post.excerpt}
                </OverrideText>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
