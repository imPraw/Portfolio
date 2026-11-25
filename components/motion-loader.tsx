"use client";

import { useEffect } from "react";
import { startMotion } from "./portfolio-motion";

export function MotionLoader() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;

    function update() {
      dispose?.();
      dispose = reduced.matches ? undefined : startMotion();
    }

    function skipIntro(event: KeyboardEvent) {
      if (event.key === "Escape") document.documentElement.dataset.skipIntro = "true";
    }

    update();
    reduced.addEventListener("change", update);
    window.addEventListener("keydown", skipIntro);
    return () => {
      reduced.removeEventListener("change", update);
      window.removeEventListener("keydown", skipIntro);
      dispose?.();
    };
  }, []);
  return null;
}
