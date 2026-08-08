"use client";

import { useEffect, useRef, useState } from "react";

const INK = "242, 241, 238";
const AMBER = "242, 163, 60";

// Hand-placed pipeline (x/y are fractions of the canvas). Kept to the upper
// right so the headline area stays clean.
const NODES = [
  { label: "WEBHOOK", x: 0.4, y: 0.46 },
  { label: "PARSE", x: 0.52, y: 0.3 },
  { label: "SCORE", x: 0.55, y: 0.58 },
  { label: "AI DRAFT", x: 0.66, y: 0.2 },
  { label: "CRM SYNC", x: 0.71, y: 0.44 },
  { label: "NOTIFY", x: 0.83, y: 0.3 },
  { label: "SHEETS", x: 0.86, y: 0.56 },
  { label: "DEPLOY", x: 0.93, y: 0.14 },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 7],
];

const LOG_LINES = [
  { ok: false, text: "→ webhook received  POST /new-lead" },
  { ok: true, text: "✓ lead enriched — clearbit  0.3s" },
  { ok: true, text: "✓ reply drafted — gpt-4  1.1s" },
  { ok: true, text: "✓ crm updated — hubspot  0.2s" },
  { ok: false, text: "→ cron fired  invoice-sync" },
  { ok: true, text: "✓ 128 rows synced — sheets  0.8s" },
  { ok: true, text: "✓ build passed — deploy #214  42s" },
  { ok: true, text: "✓ rep notified — slack  0.1s" },
];

function useTerminalLog(reduced: boolean) {
  const [lines, setLines] = useState<{ ok: boolean; text: string }[]>(
    reduced ? LOG_LINES.slice(0, 5) : [],
  );

  useEffect(() => {
    if (reduced) {
      setLines(LOG_LINES.slice(0, 5));
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      setLines((prev) => [...prev.slice(-4), LOG_LINES[i % LOG_LINES.length]]);
      i++;
    }, 1600);
    return () => clearInterval(id);
  }, [reduced]);

  return lines;
}

export default function HeroMachine() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState(false);
  const lines = useTerminalLog(reduced);

  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // canvas fonts can't use CSS vars — resolve the real Plex Mono family name
    const monoFamily =
      getComputedStyle(document.body).getPropertyValue("--mono").trim() ||
      "ui-monospace, monospace";
    let raf = 0;
    let w = 0;
    let h = 0;
    let t0 = performance.now();

    // parallax target/current offsets (lerped for weight)
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    type Pulse = { edge: number; t: number; speed: number };
    let pulses: Pulse[] = [];
    const flashes = new Array(NODES.length).fill(-9999); // last hit time per node

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (noMotion) draw(1e9);
    };

    const seedPulses = () => {
      pulses = EDGES.map((_, i) => ({
        edge: i,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
      })).filter(() => Math.random() < 0.8);
    };

    const nodePos = (i: number) => {
      const n = NODES[i];
      // deeper parallax for nodes further right (cheap depth)
      const depth = 0.5 + n.x * 0.9;
      return { x: n.x * w + cx * depth, y: n.y * h + cy * depth };
    };

    // circuit trace: horizontal → vertical → horizontal elbow
    const tracePoints = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const elbowX = a.x + (b.x - a.x) * 0.55;
      return [a, { x: elbowX, y: a.y }, { x: elbowX, y: b.y }, b];
    };

    const traceLength = (pts: { x: number; y: number }[]) => {
      let L = 0;
      for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      return L;
    };

    const pointAt = (pts: { x: number; y: number }[], t: number) => {
      const total = traceLength(pts) || 1;
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

    const draw = (now: number) => {
      const elapsed = now - t0;
      ctx.clearRect(0, 0, w, h);

      // faint blueprint grid
      ctx.strokeStyle = `rgba(${INK}, 0.035)`;
      ctx.lineWidth = 1;
      const grid = 64;
      ctx.beginPath();
      for (let x = (cx * 0.3) % grid; x < w; x += grid) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = (cy * 0.3) % grid; y < h; y += grid) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // edges — draw themselves in during intro
      EDGES.forEach(([a, b], i) => {
        const born = 500 + Math.max(a, b) * 160;
        const prog = noMotion ? 1 : ease((elapsed - born) / 900);
        if (prog <= 0) return;
        const pts = tracePoints(nodePos(a), nodePos(b));
        const L = traceLength(pts);
        ctx.save();
        ctx.setLineDash([L]);
        ctx.lineDashOffset = L * (1 - prog);
        ctx.strokeStyle = `rgba(${INK}, 0.13)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.restore();
        void i;
      });

      // pulses — amber packets with glow
      if (!noMotion && elapsed > 1800) {
        pulses.forEach((p) => {
          p.t += p.speed;
          if (p.t >= 1) {
            flashes[EDGES[p.edge][1]] = now;
            p.edge = Math.floor(Math.random() * EDGES.length);
            p.t = 0;
            p.speed = 0.003 + Math.random() * 0.004;
          }
          const [a, b] = EDGES[p.edge];
          const pos = pointAt(tracePoints(nodePos(a), nodePos(b)), p.t);
          const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 16);
          grad.addColorStop(0, `rgba(${AMBER}, 0.9)`);
          grad.addColorStop(0.3, `rgba(${AMBER}, 0.25)`);
          grad.addColorStop(1, `rgba(${AMBER}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255, 235, 200, 0.95)";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // nodes — pop in, breathe, flash amber when a packet lands
      ctx.font = `10px ${monoFamily}`;
      NODES.forEach((n, i) => {
        const born = 300 + i * 160;
        const prog = noMotion ? 1 : ease((elapsed - born) / 500);
        if (prog <= 0) return;
        const pos = nodePos(i);
        const r = 4 * prog;

        // flash ring
        const since = now - flashes[i];
        if (since < 700) {
          const k = 1 - since / 700;
          ctx.strokeStyle = `rgba(${AMBER}, ${0.7 * k})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + 4 + (1 - k) * 14, 0, Math.PI * 2);
          ctx.stroke();
        }

        const breathe = noMotion ? 0.5 : 0.5 + 0.5 * Math.sin(now * 0.0016 + i * 1.7);
        ctx.fillStyle = `rgba(${INK}, ${(0.35 + breathe * 0.35) * prog})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${INK}, ${0.5 * prog})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r + 3.5, 0, Math.PI * 2);
        ctx.stroke();

        // labels land on the headline once the copy spans the full width — below
        // 720px the dots and traces carry the graph on their own
        if (w >= 720) {
          ctx.fillStyle = `rgba(${INK}, ${0.45 * prog})`;
          ctx.fillText(n.label, pos.x + 12, pos.y + 3);
        }
      });
    };

    const loop = (now: number) => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onMouse = (e: MouseEvent) => {
      tx = (e.clientX / w - 0.5) * -26;
      ty = (e.clientY / h - 0.5) * -18;
    };

    resize();
    seedPulses();
    addEventListener("resize", resize);

    if (!noMotion) {
      addEventListener("mousemove", onMouse);
      t0 = performance.now();
      raf = requestAnimationFrame(loop);
    }

    // pause offscreen
    const io = new IntersectionObserver(([e]) => {
      if (noMotion) return;
      if (e.isIntersecting) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="machine" aria-hidden="true" />
      <div className="hero-log mono" aria-hidden="true">
        <div className="hero-log-head">
          <span className="hero-log-dot" /> autovex — live
        </div>
        {lines.map((l, i) => (
          <div key={`${l.text}-${i}`} className={l.ok ? "ok" : ""}>
            {l.text}
          </div>
        ))}
        {!reduced && <span className="hero-log-caret" />}
      </div>
    </>
  );
}
