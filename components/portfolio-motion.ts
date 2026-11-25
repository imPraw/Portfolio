export function startMotion() {
  const animations = new Set<Animation>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const animation = entry.target.animate(
        [{ transform: "translateY(8px)" }, { transform: "translateY(0)" }],
        { duration: 320, easing: "cubic-bezier(.22, 1, .36, 1)" },
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    }
  });

  for (const heading of document.querySelectorAll("[data-reveal]")) {
    if (heading.getBoundingClientRect().top >= window.innerHeight) observer.observe(heading);
  }

  return () => {
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
  };
}
