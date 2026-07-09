"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Pipeline spine — a fixed vertical trace on the right edge. An amber
 * packet rides the user's scroll position (down when scrolling down, back
 * up when scrolling up) with a smooth lag; ticks mark each section and
 * light up once the packet passes them. The page's scroll = a job
 * traveling through the pipeline.
 *
 * Desktop only (hidden < 1100px via CSS). Hidden under reduced motion.
 * Revert: remove <ScrollSpine /> from layout.tsx, delete this file + CSS.
 */

const SECTIONS = ["#services", "#work", "#teardown", "#process", "#contact"];

export default function ScrollSpine() {
  const packetRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);
  const [ticks, setTicks] = useState<{ pos: number; id: string }[]>([]);
  const [progress, setProgress] = useState(0); // for tick lit state only

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setHidden(false);

    // tick positions as fractions of total scrollable height
    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return;
      setTicks(
        SECTIONS.map((sel) => {
          const el = document.querySelector<HTMLElement>(sel);
          if (!el) return null;
          // where the packet is when the section top hits mid-viewport
          const pos = Math.min(Math.max((el.offsetTop - innerHeight * 0.5) / max, 0), 1);
          return { pos, id: sel.slice(1) };
        }).filter((t): t is { pos: number; id: string } => t !== null),
      );
    };

    let target = 0;
    let current = 0;
    let velocity = 0;
    let raf = 0;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      target = max > 0 ? scrollY / max : 0;
    };

    const loop = () => {
      const prev = current;
      current += (target - current) * 0.08; // weighty lag
      velocity = current - prev;
      const packet = packetRef.current;
      const trail = trailRef.current;
      if (packet) {
        packet.style.top = `${current * 100}%`;
        // stretch slightly with speed, like a packet under load
        const stretch = Math.min(Math.abs(velocity) * 900, 26);
        packet.style.height = `${8 + stretch}px`;
      }
      if (trail) trail.style.height = `${current * 100}%`;
      // update tick lit state only on meaningful movement (cheap re-render)
      setProgress((p) => (Math.abs(p - current) > 0.004 ? current : p));
      raf = requestAnimationFrame(loop);
    };

    measure();
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    raf = requestAnimationFrame(loop);

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className="spine" aria-hidden="true">
      <div className="spine-track" />
      <div className="spine-trail" ref={trailRef} />
      {ticks.map((t) => (
        <span
          key={t.id}
          className={`spine-tick${progress >= t.pos ? " lit" : ""}`}
          style={{ top: `${t.pos * 100}%` }}
        />
      ))}
      <div className="spine-packet" ref={packetRef} />
    </div>
  );
}
