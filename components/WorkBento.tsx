import { Fragment } from "react";
import type { WorkItem } from "@/content";

// Replaces the old 3D coverflow (FocusRail.tsx, deleted) per explicit
// request — that only ever showed one legible card at a time behind a
// synced "info" panel below it. This shows every case study at once in an
// asymmetric bento grid: the first (real, most substantial) item runs as
// a wide feature card, the rest fill in as standard cards. Real content
// only — no fabricated case studies — same reasoning as everywhere else
// on this site that a supplied brief's placeholder copy gets swapped for
// Autovex's actual, true content.
export default function WorkBento({ items }: { items: WorkItem[] }) {
  if (items.length === 0) return null;
  const [feature, ...rest] = items;

  return (
    <div className="bento-grid">
      <BentoCard item={feature} featured />
      {rest.map((item) => (
        <BentoCard item={item} key={item.title} />
      ))}
    </div>
  );
}

function BentoCard({ item, featured }: { item: WorkItem; featured?: boolean }) {
  return (
    <div className={`bento-card${featured ? " feature" : ""}`}>
      <div className="bento-glow" aria-hidden="true" />
      <div className="rc-top mono">
        <span>{item.category}</span>
        {item.sample && <span className="sample-chip">Sample</span>}
      </div>
      {item.image ? (
        <img
          className="rc-img"
          src={item.image}
          alt={`${item.title} — ${item.category} case study by Autovex Solutions`}
          loading="lazy"
        />
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
      <div className="bento-text">
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <span className="case-metric">{item.metric}</span>
      </div>
    </div>
  );
}
