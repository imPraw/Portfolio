import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function startMotion() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ anchors: { offset: -88 }, duration: 0.95 });
  const tick = (time: number) => lenis.raf(time * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  const media = gsap.matchMedia();

  const context = gsap.context(() => {
    for (const element of gsap.utils.toArray<HTMLElement>("[data-reveal]")) {
      if (element.getBoundingClientRect().top < window.innerHeight) continue;
      gsap.from(element, {
        y: 20, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 94%", once: true },
      });
    }

    const story = document.querySelector("[data-word-story]");
    if (story) {
      gsap.from(story.children, {
        opacity: 0.74,
        stagger: 0.035,
        ease: "none",
        scrollTrigger: { trigger: story, start: "top 94%", end: "bottom 60%", scrub: true },
      });
    }

    for (const counter of gsap.utils.toArray<HTMLElement>("[data-counter]")) {
      const target = Number(counter.dataset.counter);
      const value = { count: 0 };
      gsap.to(value, {
        count: target, duration: 0.65, ease: "power2.out",
        onUpdate: () => { counter.textContent = String(Math.round(value.count)); },
        scrollTrigger: { trigger: counter, start: "top 96%", once: true },
      });
    }
  });

  media.add("(min-width: 900px) and (pointer: fine)", () => {
    gsap.to("[data-hero-art]", {
      yPercent: 9, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.fromTo("[data-portrait]", { yPercent: -4 }, {
      yPercent: 4, ease: "none",
      scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
    });
    for (const art of gsap.utils.toArray<HTMLElement>(".art-canvas")) {
      gsap.fromTo(art, { yPercent: -2 }, {
        yPercent: 2, ease: "none",
        scrollTrigger: { trigger: art.closest(".project"), start: "top bottom", end: "bottom top", scrub: true },
      });
    }
    const cursor = document.createElement("span");
    cursor.className = "cursor-ring";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    const x = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
    const y = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });

    function onMove(event: PointerEvent) {
      x(event.clientX);
      y(event.clientY);
      const interactive = (event.target as Element | null)?.closest("[data-magnetic]");
      cursor.classList.toggle("visible", Boolean(interactive));
    }
    function hide() { cursor.classList.remove("visible"); }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", hide);
    const cleanup = gsap.utils.toArray<HTMLElement>("[data-magnetic]").map((button) => {
      const moveX = gsap.quickTo(button, "x", { duration: 0.3, ease: "power3.out" });
      const moveY = gsap.quickTo(button, "y", { duration: 0.3, ease: "power3.out" });
      function move(event: PointerEvent) {
        const bounds = button.getBoundingClientRect();
        moveX((event.clientX - bounds.left - bounds.width / 2) * 0.12);
        moveY((event.clientY - bounds.top - bounds.height / 2) * 0.18);
      }
      function reset() { moveX(0); moveY(0); }
      button.addEventListener("pointermove", move, { passive: true });
      button.addEventListener("pointerleave", reset);
      return () => {
        button.removeEventListener("pointermove", move);
        button.removeEventListener("pointerleave", reset);
        gsap.set(button, { clearProps: "transform" });
      };
    });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", hide);
      cleanup.forEach((remove) => remove());
      cursor.remove();
    };
  });

  return () => {
    media.revert();
    context.revert();
    document.querySelectorAll<HTMLElement>("[data-counter]").forEach((counter) => {
      counter.textContent = counter.dataset.counter ?? "";
    });
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
