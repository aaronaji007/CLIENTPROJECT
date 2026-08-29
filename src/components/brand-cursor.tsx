"use client";

import { useEffect, useState } from "react";
import SplashCursor from "@/components/bits/SplashCursor";

export function BrandCursor() {
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOk(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!motionOk) return null;
  return <SplashCursor TRANSPARENT COLOR="#b06a3a" />;
}
