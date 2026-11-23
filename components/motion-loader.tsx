"use client";

import { useEffect } from "react";

export function MotionLoader() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    let generation = 0;

    function update() {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      if (reduced.matches) return;
      void import("./portfolio-motion").then(({ startMotion }) => {
        if (generation === current) dispose = startMotion();
      }).catch(() => {
        // CSS and native scrolling remain available when the motion chunk cannot load.
      });
    }

    function skipIntro(event: KeyboardEvent) {
      if (event.key === "Escape") document.documentElement.dataset.skipIntro = "true";
    }

    const timer = window.setTimeout(update, 350);
    reduced.addEventListener("change", update);
    window.addEventListener("keydown", skipIntro);
    return () => {
      ++generation;
      window.clearTimeout(timer);
      reduced.removeEventListener("change", update);
      window.removeEventListener("keydown", skipIntro);
      dispose?.();
    };
  }, []);
  return null;
}
