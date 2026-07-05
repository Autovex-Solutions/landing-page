/* Landing page sections. Server components — content lives in content.ts. */
import { contact, stack, steps, workItems } from "@/content";

export function Nav() {
  return (
    <nav>
      <a className="brand" href="#">
        {/* ponytail: plain img — logo is a tiny png, next/image adds nothing here */}
        <img src="/logo-mark-white.png" alt="Autovex mark" />
        <span>AUTOVEX SOLUTIONS</span>
      </a>
      <div className="nav-links">
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#process">Process</a>
        <a className="solid" href="#contact">
          Book a call
        </a>
      </div>
    </nav>
  );
}

export function Hero() {
  return (
    <header>
      <div className="sky" />
      <video className="bgvid" autoPlay muted loop playsInline src="/hero-loop.mp4" />
      <div className="veil" />
      <div className="hero-inner">
        <p className="mono eyebrow">Automation &middot; Web &middot; Mobile</p>
        <h1>The busywork ends here.</h1>
        <p className="hero-sub">
          Autovex builds automation pipelines, web platforms and mobile apps that take
          repetitive work off your team&apos;s plate &mdash; shipped in weeks, not quarters.
        </p>
        <div className="cta-row">
          <a className="btn primary" href="#contact">
            Book a call <span className="arrow">&rarr;</span>
          </a>
          <a className="btn ghost" href="#work">
            See the work <span className="arrow">&rarr;</span>
          </a>
        </div>
        <div className="hero-foot">
          <span className="mono">We build with</span>
          <div className="stack-list mono">
            {stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
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
        <h2>
          Automation first. <span className="dim">Everything else follows.</span>
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
          <div className="flow" aria-label="Example automation flow">
            <span className="chip">
              &#9679; New lead form submitted <small>trigger</small>
            </span>
            <span className="down">&darr;</span>
            <span className="chip dim">Enrich &amp; score the lead</span>
            <span className="down">&darr;</span>
            <span className="chip dim">Draft a personalised reply</span>
            <span className="down">&darr;</span>
            <span className="chip">
              &#10003; CRM updated, rep notified <small>4 sec</small>
            </span>
          </div>
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

export function Work() {
  return (
    <section id="work">
      <div className="section-head reveal">
        <p className="mono eyebrow">Selected work</p>
        <h2>Proof over promises.</h2>
        <p className="work-note">Sample layout &mdash; real case studies drop in as we ship them</p>
      </div>
      <div className="section-body work-grid">
        {workItems.map((item) => (
          <div className="case reveal" key={item.title}>
            <div className="case-thumb">
              {item.image && <img src={item.image} alt={item.title} />}
              {item.sample && <span className="sample-chip">Sample</span>}
            </div>
            <div className="case-body">
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <span className="case-metric">{item.metric}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process">
      <div className="section-head reveal">
        <p className="mono eyebrow">How it works</p>
        <h2>
          Four steps. <span className="dim">No black box.</span>
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
      <div className="reveal">
        <p className="mono eyebrow">Start here</p>
        <h2>Tell us what&apos;s slowing you down.</h2>
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
