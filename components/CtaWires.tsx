"use client";

import { useEffect, useRef } from "react";

/*
 * CTA "wiring in" effect. Every few seconds one floating tool tile lights
 * up and a hairline circuit trace draws from it into the booking button;
 * a packet travels the wire and the button answers with a soft expanding
 * ring. One wire at a time — the tools around the CTA getting wired into
 * the call. Runs only while the section is on screen.
 *
 * Reduced motion: renders nothing. Revert: remove <CtaWires /> from the
 * Cta section in sections.tsx, delete this file + its CSS block.
 */

type Pt = { x: number; y: number };

const DRAW = 620; // trace draws tile → button
const TRAVEL = 640; // packet rides the wire
const RING = 720; // button ring + trace fade
const IDLE = 900; // rest before the next tool fires
const TOTAL = DRAW + TRAVEL + RING + IDLE;

export default function CtaWires() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = canvas.closest("section");
    if (!section) return;

    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    let tiles: HTMLElement[] = [];
    let tileIdx = 0;
    let cycleStart = 0;
    let firing: HTMLElement | null = null;

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = section.clientWidth;
      h = section.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const collect = () => {
      tiles = [...section.querySelectorAll<HTMLElement>(".tile")].filter(
        (t) => t.getBoundingClientRect().width > 0,
      );
    };

    const center = (el: Element): Pt => {
      const r = el.getBoundingClientRect();
      const s = section.getBoundingClientRect();
      return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
    };

    // wire: vertical run from the tile, then horizontal into the button's side
    const wirePath = (tile: Pt, btn: Element): Pt[] => {
      const r = btn.getBoundingClientRect();
      const s = section.getBoundingClientRect();
      const by = r.top - s.top + r.height / 2;
      const side = tile.x < r.left - s.left + r.width / 2;
      const bx = side ? r.left - s.left - 6 : r.right - s.left + 6;
      return [tile, { x: tile.x, y: by }, { x: bx, y: by }];
    };

    const pathLength = (pts: Pt[]) => {
      let L = 0;
      for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      return L;
    };

    const pointAt = (pts: Pt[], t: number): Pt => {
      const total = pathLength(pts) || 1;
      let d = t * total;
      for (let i = 1; i < pts.length; i++) {
        const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        if (d <= seg) {
          const k = seg ? d / seg : 0;
          return {
            x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k,
            y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k,
          };
        }
        d -= seg;
      }
      return pts[pts.length - 1];
    };

    const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

    const loop = (now: number) => {
      if (!cycleStart) cycleStart = now;
      let t = now - cycleStart;
      if (t >= TOTAL) {
        firing?.classList.remove("firing");
        firing = null;
        cycleStart = now;
        t = 0;
        tileIdx = (tileIdx + 1) % (tiles.length || 1);
      }

      ctx.clearRect(0, 0, w, h);
      const btn = section.querySelector(".btn.primary");
      const tile = tiles[tileIdx];
      if (!btn || !tile) {
        raf = requestAnimationFrame(loop);
        return;
      }

      if (!firing && t < DRAW + TRAVEL) {
        firing = tile;
        firing.classList.add("firing");
      }

      const pts = wirePath(center(tile), btn);
      const L = pathLength(pts);

      // trace: draws in, holds, fades out during RING
      const drawProg = ease(t / DRAW);
      const fade = t > DRAW + TRAVEL ? 1 - Math.min((t - DRAW - TRAVEL) / RING, 1) : 1;
      if (t < DRAW + TRAVEL + RING && fade > 0) {
        ctx.save();
        ctx.setLineDash([L]);
        ctx.lineDashOffset = L * (1 - drawProg);
        ctx.strokeStyle = `rgba(242, 163, 60, ${0.34 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.restore();
      }

      // packet riding the wire
      if (t >= DRAW && t < DRAW + TRAVEL) {
        const pos = pointAt(pts, ease((t - DRAW) / TRAVEL));
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 13);
        glow.addColorStop(0, "rgba(242, 163, 60, 0.8)");
        glow.addColorStop(1, "rgba(242, 163, 60, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 235, 200, 0.95)";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // button answers: expanding rounded-rect ring
      if (t >= DRAW + TRAVEL && t < DRAW + TRAVEL + RING) {
        const k = ease((t - DRAW - TRAVEL) / RING);
        const r = btn.getBoundingClientRect();
        const s = section.getBoundingClientRect();
        const pad = 4 + k * 22;
        ctx.strokeStyle = `rgba(242, 163, 60, ${0.5 * (1 - k)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
          r.left - s.left - pad,
          r.top - s.top - pad,
          r.width + pad * 2,
          r.height + pad * 2,
          6 + k * 14,
        );
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      collect();
      cycleStart = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      firing?.classList.remove("firing");
      firing = null;
    };

    const onResize = () => {
      size();
      collect();
    };

    size();
    addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0.25,
    });
    io.observe(section);

    return () => {
      stop();
      io.disconnect();
      removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="cta-wires" aria-hidden="true" />;
}
