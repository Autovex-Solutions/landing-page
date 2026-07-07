"use client";

import { Fragment, useRef, useState } from "react";
import type { WorkItem } from "@/content";

// 3D coverflow rail for the work section. Cards draw each project's pipeline
// as node chips (house .flow language) instead of stock imagery.
// ponytail: no framer-motion — CSS transitions cover the coverflow; spring
// drag physics traded for a plain pointer swipe. Add the lib if we ever want
// cards to follow the finger mid-drag.
const wrap = (n: number, len: number) => ((n % len) + len) % len;
const OFFSETS = [-2, -1, 0, 1, 2];

export default function FocusRail({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState(0);
  const drag = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const activeItem = items[wrap(active, items.length)];

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current === null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (Math.abs(dx) > 50) {
      setActive((a) => (dx < 0 ? a + 1 : a - 1));
      suppressClick.current = true; // swallow the click this drag produced
      setTimeout(() => (suppressClick.current = false), 0);
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setActive((a) => a - 1);
    if (e.key === "ArrowRight") setActive((a) => a + 1);
  };

  return (
    <div className="rail">
      <div
        className="rail-stage"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Selected work"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => (drag.current = null)}
      >
        {OFFSETS.map((offset) => {
          const abs = active + offset;
          const item = items[wrap(abs, items.length)];
          const dist = Math.abs(offset);
          const center = offset === 0;
          return (
            <div
              key={abs}
              className={`rail-card${center ? " center" : ""}`}
              aria-hidden={!center}
              style={{
                transform: `translate(-50%, -50%) translateX(calc(var(--rail-step) * ${offset})) translateZ(${-dist * 170}px) rotateY(${offset * -18}deg) scale(${center ? 1 : 0.88})`,
                opacity: center ? 1 : Math.max(0.15, 1 - dist * 0.45),
                filter: center ? "none" : `blur(${dist * 3}px) brightness(0.55)`,
                zIndex: 20 - dist,
              }}
              onClick={() => {
                if (!center && !suppressClick.current) setActive((a) => a + offset);
              }}
            >
              <div className="rc-top mono">
                <span>{item.category}</span>
                {item.sample && <span className="sample-chip">Sample</span>}
              </div>
              {item.image ? (
                <img className="rc-img" src={item.image} alt="" />
              ) : (
                <div className="rc-diagram">
                  {item.nodes?.map((n, i) => (
                    <Fragment key={n}>
                      {i > 0 && <span className="rc-link" />}
                      <span className={`rc-node${i === 0 || i === item.nodes!.length - 1 ? " hot" : ""}`}>{n}</span>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rail-info">
        {/* key change remounts the block so the entrance animation replays */}
        <div className="rail-info-text" key={activeItem.title} aria-live="polite">
          <span className="mono rail-cat">{activeItem.category}</span>
          <h3>{activeItem.title}</h3>
          <p>{activeItem.summary}</p>
          <span className="case-metric">{activeItem.metric}</span>
        </div>
        <div className="rail-ctrl mono">
          <button onClick={() => setActive((a) => a - 1)} aria-label="Previous project">
            &larr;
          </button>
          <span>
            {wrap(active, items.length) + 1} / {items.length}
          </span>
          <button onClick={() => setActive((a) => a + 1)} aria-label="Next project">
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
