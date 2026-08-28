"use client";

import type { ReactNode } from "react";
import { useContentOverrides } from "@/lib/override-context";

type Kind = "specialties" | "packages" | "posts";

export function OverrideText({
  kind,
  slug,
  field,
  children,
}: {
  kind: Kind;
  slug: string;
  field: string;
  children: ReactNode;
}) {
  const ov = useContentOverrides();
  const value = (ov[kind]?.[slug] as Record<string, unknown> | undefined)?.[field];
  if (typeof value === "string" && value.length > 0) return <>{value}</>;
  return <>{children}</>;
}
