import { notFound } from "next/navigation";
import Link from "next/link";
import { posts } from "@/lib/data";
import { ArrowIcon } from "@/components/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
      >
        <ArrowIcon direction="left" /> Journal
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
          <span className="text-signal">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.date}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/70">{post.excerpt}</p>
      </header>

      <div className="mt-10 space-y-5 border-t border-line pt-10">
        {post.body.map((paragraph, i) => (
          <p
            key={i}
            className={`leading-relaxed text-ink/80 ${i === 0 ? "text-lg text-ink/85" : ""}`}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <footer className="mt-12 rounded-sm border border-line bg-paper-deep/50 p-5">
        <p className="text-sm font-medium text-ink">Planning to seek care abroad?</p>
        <p className="mt-1 text-sm text-ink/60">
          Start with a conversation in your local time. Nothing is charged and nothing is
          decided on a first consult.
        </p>
        <Link
          href="/#consult"
          className="mt-4 inline-block rounded-sm bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-soft"
        >
          Book a consultation
        </Link>
      </footer>
    </article>
  );
}
