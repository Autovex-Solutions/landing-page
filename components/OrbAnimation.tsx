// Pure-CSS animated orb v2 (see .orb-* rules in globals.css) — glowing core
// sphere + 3 rotating rings + 4 cardinal orbiting icon chips. Replaces the
// original smaller/floating-icon version per feedback. No JS beyond mounting
// the markup; respects prefers-reduced-motion via the CSS.
//
// The chip icons sit in a static "mount" div (top/right/bottom/left,
// positioned via transform: translate) nested inside a separate element that
// only animates rotation (counter-spin). Two levels, not one: a single
// element can't hold both a static positional transform and an animated
// transform at once without the animation clobbering the position.
import { Code2, Cpu, Shield, Sparkles, Zap } from "lucide-react";

const CHIPS = [
  { Icon: Zap, mount: "top", shape: "square" as const },
  { Icon: Shield, mount: "right", shape: "round" as const },
  { Icon: Cpu, mount: "bottom", shape: "round" as const },
  { Icon: Code2, mount: "left", shape: "square" as const },
];

export default function OrbAnimation() {
  return (
    <div className="orb-wrap" aria-hidden="true">
      <div className="orb-core">
        <Sparkles strokeWidth={2.5} />
      </div>
      <div className="orb-ring-inner" />
      <div className="orb-ring-middle" />
      <div className="orb-ring-outer">
        {CHIPS.map(({ Icon, mount, shape }) => (
          <div className={`orb-chip-mount orb-chip-mount--${mount}`} key={mount}>
            <div className={`orb-chip${shape === "round" ? " round" : ""}`}>
              <Icon strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
