// Server component — hover-invert is pure CSS, no client JS needed (same
// reasoning as ToolMarquee). Replaces the old hand-built flow-diagram cards
// (FlowDemo/WebDemo/MobileDemo, removed) with a plain bordered grid.
import { features } from "@/content";

export default function FeatureGrid() {
  return (
    <div className="feature-grid">
      {features.map(({ id, title, description, Icon }) => (
        <div className="feature-card" key={id}>
          <div className="feature-card-top">
            <span className="feature-icon">
              <Icon size={20} strokeWidth={1.5} />
            </span>
            <span className="feature-id mono">{id}</span>
          </div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      ))}
    </div>
  );
}
