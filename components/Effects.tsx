"use client";

import { useEffect } from "react";

// Film grain overlay + scroll reveals. Respects prefers-reduced-motion.
export default function Effects() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.getElementById("grain") as HTMLCanvasElement | null;
    const paintGrain = () => {
      if (!canvas) return;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = ctx.createImageData(canvas.width, canvas.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 28;
      }
      ctx.putImageData(img, 0, 0);
    };
    paintGrain();
    addEventListener("resize", paintGrain);

    const els = document.querySelectorAll(".reveal, .rise");
    let io: IntersectionObserver | undefined;
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io!.unobserve(e.target);
            }
          });
        },
        // fire ~180px before entry so fast scrollers never see blank sections
        { threshold: 0, rootMargin: "0px 0px 180px 0px" },
      );
      els.forEach((el) => io!.observe(el));
    }

    return () => {
      removeEventListener("resize", paintGrain);
      io?.disconnect();
    };
  }, []);

  return <canvas id="grain" aria-hidden="true" />;
}
