// Pure-CSS animated orb (see .orb-* rules in globals.css) — gradient sphere +
// 3 rotating rings + orbiting/floating icon chips. No JS beyond mounting the
// markup; all motion is CSS animation, and respects prefers-reduced-motion
// via the CSS itself. Icons are lucide-react (already a dependency) standing
// in for the original hand-drawn SVGs — the CSS targets a bare `svg` child
// selector, so any inline SVG (Lucide's included) sizes/positions correctly.
import { BarChart3, Shield, Sparkles, Users, Zap } from "lucide-react";

export default function OrbAnimation({ size = 260 }: { size?: number }) {
  return (
    <div className="orb-wrap" style={{ width: size, height: size }} aria-hidden="true">
      <div className="orb-glow" />
      <div className="ring ring-dashed" />
      <div className="ring ring-teal" />
      <div className="ring ring-dots" />
      <div className="orb-sphere">
        <Sparkles />
      </div>
      <div className="orbit orbit-bolt">
        <div className="icon-chip icon-bolt">
          <Zap />
        </div>
      </div>
      <div className="orbit orbit-shield">
        <div className="icon-chip icon-shield">
          <Shield />
        </div>
      </div>
      <div className="float-icon icon-bars">
        <BarChart3 />
      </div>
      <div className="float-icon icon-users">
        <Users />
      </div>
    </div>
  );
}
