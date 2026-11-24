import type { MetadataRoute } from "next";
import { db } from "@/prisma/db";
import { readOverrides } from "@/lib/server-overrides";
import {
  specialties as fallbackSpecialties,
  packages as fallbackPackages,
  posts as defaultPosts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://medycare.example");

  let specSlugs = fallbackSpecialties.map((s) => s.slug);
  let pkgSlugs = fallbackPackages.map((p) => p.slug);

  try {
    const dbSpecs = await db.orm.public.Specialty.all();
    if (dbSpecs.length > 0) specSlugs = dbSpecs.map((s) => s.slug);
    const dbPkgs = await db.orm.public.Package.all();
    if (dbPkgs.length > 0) pkgSlugs = dbPkgs.map((p) => p.slug);
  } catch {
    /* fallback to static slugs */
  }

  const ov = await readOverrides();
  const postSlugs = (ov.allPosts && ov.allPosts.length > 0 ? ov.allPosts : defaultPosts).map(
    (p) => p.slug,
  );

  const staticRoutes = ["", "/specialties", "/packages", "/consult", "/faq", "/blog"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...specSlugs.map((slug) => ({
      url: `${base}/specialties/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...pkgSlugs.map((slug) => ({
      url: `${base}/packages/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...postSlugs.map((slug) => ({
      url: `${base}/blog/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
