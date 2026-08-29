"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollTriggerRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener("load", refresh);
    const t1 = setTimeout(refresh, 600);
    const t2 = setTimeout(refresh, 1500);
    const t3 = setTimeout(refresh, 3000);
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
  return null;
}
