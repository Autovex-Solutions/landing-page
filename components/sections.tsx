/* Landing page sections. Server components — content lives in content.ts.
   Nav lives in components/Nav.tsx (client — scroll + menu state). */
import { contact, steps, teardown, workItems } from "@/content";
import CtaIconField from "@/components/CtaIconField";
import CtaWires from "@/components/CtaWires";
import FlowDemo from "@/components/FlowDemo";
import HeroMachine from "@/components/HeroMachine";
import FocusRail from "@/components/FocusRail";
import TeardownSketch from "@/components/TeardownSketch";
import ToolMarquee from "@/components/ToolMarquee";

/* Words wrapped for the masked rise-on-scroll effect (.rise gets .in from Effects). */
function Rise({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span className="w" key={i}>
          <span style={{ transitionDelay: `${(offset + i) * 55}ms` }}>{word}</span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <header>
      <div className="sky" />
      {/* Revert to Ishaq's original: replace the line below with
          <DottedWave variant="hero" /> and re-add
          import DottedWave from "@/components/DottedWave"; */}
      <HeroMachine />
      <div className="hero-inner">
        <p className="mono eyebrow">Automation &middot; Web &middot; Mobile</p>
        <h1 className="rise">
          <Rise text="The busywork ends here." />
        </h1>
        <p className="hero-sub">
          Autovex builds automation pipelines, web platforms and mobile apps that take
          repetitive work off your team&apos;s plate &mdash; shipped in weeks, not quarters.
        </p>
        <div className="cta-row">
          <a className="btn primary" href="#contact">
            Book a call <span className="arrow">&rarr;</span>
          </a>
          <a className="btn ghost" href="#teardown">
            Get a free teardown <span className="arrow">&rarr;</span>
          </a>
        </div>
        <div className="hero-foot">
          <span className="mono tools-label">We build with &amp; wire into</span>
          <ToolMarquee />
        </div>
      </div>
    </header>
  );
}

export function Services() {
  return (
    <section id="services">
      <div className="section-head reveal">
        <p className="mono eyebrow">What we do</p>
        <h2 className="rise">
          <Rise text="Automation first." />{" "}
          <span className="dim">
            <Rise text="Everything else follows." offset={2} />
          </span>
        </h2>
      </div>
      <div className="section-body svc-grid">
        <div className="svc lead reveal">
          <div className="svc-col">
            <div className="svc-tag mono">
              <span>01 / Automation</span>
              <span>Core service</span>
            </div>
            <h3>Workflows that run themselves</h3>
            <p>
              We wire your tools together &mdash; CRM, inbox, sheets, invoicing &mdash; into
              pipelines that handle the busywork end to end. AI where it helps, deterministic
              where it matters.
            </p>
          </div>
          {/* Revert to Ishaq's original: restore the static .flow markup here (see git) */}
          <FlowDemo />
        </div>
        <div className="svc reveal">
          <div className="svc-tag mono">
            <span>02 / Web</span>
          </div>
          <h3>Sites &amp; platforms that sell</h3>
          <p>Fast, search-friendly marketing sites and web apps &mdash; built to convert, not just to exist.</p>
        </div>
        <div className="svc reveal">
          <div className="svc-tag mono">
            <span>03 / Mobile</span>
          </div>
          <h3>Apps people keep</h3>
          <p>iOS and Android from one codebase, from prototype to store release.</p>
        </div>
      </div>
    </section>
  );
}

/* Case-study rail — coverflow of pipeline-diagram cards (FocusRail.tsx).
   Renders nothing while workItems is empty (nav link hides too). */
export function Projects() {
  if (workItems.length === 0) return null;
  return (
    <section id="work">
      <div className="section-head reveal">
        <p className="mono eyebrow">Selected work</p>
        <h2 className="rise">
          <Rise text="Shipped and running." />{" "}
          <span className="dim">
            <Rise text="Client names stay private." offset={3} />
          </span>
        </h2>
      </div>
      <div className="section-body reveal">
        <FocusRail items={workItems} />
      </div>
    </section>
  );
}

export function Teardown() {
  return (
    <section id="teardown">
      <div className="section-head reveal">
        <p className="mono eyebrow">{teardown.eyebrow}</p>
        <h2 className="rise">
          <Rise text={teardown.heading} />{" "}
          <span className="dim">
            <Rise text={teardown.headingDim} offset={4} />
          </span>
        </h2>
        <p className="lede">{teardown.body}</p>
      </div>
      <div className="section-body reveal">
        <TeardownSketch />
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process">
      <div className="section-head reveal">
        <p className="mono eyebrow">How it works</p>
        <h2 className="rise">
          <Rise text="Four steps." />{" "}
          <span className="dim">
            <Rise text="No black box." offset={2} />
          </span>
        </h2>
      </div>
      <div className="section-body steps">
        {steps.map((step, i) => (
          <div className="step reveal" key={step.title}>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="cta" id="contact">
      {/* floating tool tiles — the CTA's ambient layer (hero keeps the dot-wave) */}
      <CtaIconField />
      {/* wires tools into the booking button one at a time (CtaWires.tsx) */}
      <CtaWires />
      <div className="cta-inner reveal">
        <p className="mono eyebrow">Start here</p>
        <h2 className="rise">
          <Rise text="Tell us what's slowing you down." />
        </h2>
        <p>
          A 20-minute call. You describe the bottleneck, we tell you honestly whether
          automation pays for itself.
        </p>
        <div className="cta-row">
          <a className="btn primary" href={contact.bookingUrl}>
            Book a 20-min call <span className="arrow">&rarr;</span>
          </a>
        </div>
        <p className="alt">
          or write to <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <img src="/logo-lockup-white.png" alt="Autovex Solutions" />
      <span className="mono">
        &copy; {new Date().getFullYear()} Autovex Solutions &mdash; Automation &middot; Web &middot; Mobile
      </span>
    </footer>
  );
}
