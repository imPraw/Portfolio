"use client";

import { useEffect } from "react";

export function MotionLoader() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    let generation = 0;
    let started = false;

    function update() {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      if (!started || reduced.matches) return;
      void import("./portfolio-motion").then(({ startMotion }) => {
        if (generation === current) dispose = startMotion();
      }).catch(() => {
        // CSS and native scrolling remain available when the motion chunk cannot load.
      });
    }

    function startOnScroll() {
      if (started) return;
      started = true;
      update();
      window.removeEventListener("wheel", startOnScroll);
      window.removeEventListener("scroll", startOnScroll);
    }

    function skipIntro(event: KeyboardEvent) {
      if (event.key === "Escape") document.documentElement.dataset.skipIntro = "true";
    }

    window.addEventListener("wheel", startOnScroll, { passive: true });
    window.addEventListener("scroll", startOnScroll, { passive: true });
    reduced.addEventListener("change", update);
    window.addEventListener("keydown", skipIntro);
    return () => {
      ++generation;
      window.removeEventListener("wheel", startOnScroll);
      window.removeEventListener("scroll", startOnScroll);
      reduced.removeEventListener("change", update);
      window.removeEventListener("keydown", skipIntro);
      dispose?.();
    };
  }, []);
  return null;
}
