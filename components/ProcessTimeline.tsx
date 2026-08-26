// Mobile-only replacement for the desktop "Our Process" 4-up text grid
// (the .steps markup in sections.tsx, left untouched for >= 768px).
// Nobody reads four paragraphs of process copy on a phone — this is the
// scannable version: number, icon, bold title, nothing else. Full step
// body text lives only in the desktop grid.
import { Compass, Hammer, PenTool, Rocket, type LucideIcon } from "lucide-react";
import { steps } from "@/content";

const ICONS: Record<string, LucideIcon> = {
  Discover: Compass,
  Design: PenTool,
  Build: Hammer,
  "Launch & Scale": Rocket,
};

export default function ProcessTimeline() {
  return (
    <ol className="proc-timeline">
      {steps.map((step, i) => {
        const Icon = ICONS[step.title] ?? Compass;
        return (
          <li className="proc-row" key={step.title}>
            <span className="proc-icon" aria-hidden="true">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <span className="proc-num mono" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="proc-title">{step.title}</h3>
          </li>
        );
      })}
    </ol>
  );
}
