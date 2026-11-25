"use client";

import { useEffect, type RefObject } from "react";

export default function SkillMotion({ panel, selected }: { panel: RefObject<HTMLDivElement | null>; selected: number }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!panel.current || reduced.matches) return;
    const animation = panel.current.animate(
      [{ transform: "translateY(4px)" }, { transform: "translateY(0)" }],
      { duration: 180, easing: "ease-out" },
    );
    const cancel = () => animation.cancel();
    reduced.addEventListener("change", cancel);
    return () => {
      reduced.removeEventListener("change", cancel);
      cancel();
    };
  }, [panel, selected]);
  return null;
}
