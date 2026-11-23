"use client";

import { useEffect, type RefObject } from "react";
import { animate } from "motion";

export default function SkillMotion({ panel, selected }: { panel: RefObject<HTMLDivElement | null>; selected: number }) {
  useEffect(() => {
    if (!panel.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = animate(panel.current, { opacity: [0.75, 1], y: [6, 0] }, { duration: 0.28, ease: [0.22, 1, 0.36, 1] });
    return () => animation.cancel();
  }, [panel, selected]);
  return null;
}
