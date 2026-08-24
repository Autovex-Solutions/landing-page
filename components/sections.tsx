
import { Fragment } from "react";
import { contact, footerBio, getNavLinks, socials, steps, teardown, workItems } from "@/content";
import CtaIconField from "@/components/CtaIconField";
import FlowDemo from "@/components/FlowDemo";
import HeroMachine from "@/components/HeroMachine";
import FocusRail from "@/components/FocusRail";
import OrbAnimation from "@/components/OrbAnimation";
import ServicesAccordion from "@/components/ServicesAccordion";
import TeardownCard from "@/components/TeardownCard";
import TeardownSketch from "@/components/TeardownSketch";
import ToolMarquee from "@/components/ToolMarquee";
import WebDemo from "@/components/WebDemo";
import MobileDemo from "@/components/MobileDemo";


/* Each word gets its own masked span so it can rise independently. The space between
   spans is load-bearing for SEO, not for looks: without a real space character the DOM
   text reads "EngineeredforImpact." to a crawler. The width it adds is cancelled by
   `word-spacing` on .rise — see globals.css. No space after the last word: on the
   centre-aligned CTA heading a trailing one shifts the whole line ~4px.
   split(/\s+/) so a line break in the JSX source can't emit empty word spans. */
function Rise({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.trim().split(/\s+/);
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w">
            <span style={{ transitionDelay: `${(offset + i) * 55}ms` }}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <header>
      <div className="sky" />
     
      <HeroMachine />
      <div className="hero-inner">
       <div className="hero-pill mono">
          <span className="hero-pill-dot"></span>
          AI Automation • Web Apps • Mobile Apps
        </div>
        <h1 className="rise">
          <Rise text="Engineered for
          Impact." />
        </h1>
        <p className="hero-sub">
          Autovex Solutions builds AI automation, custom software, web platforms, and mobile apps that solve real business problems.
        </p>
        <div className="cta-row"> 
          <a
               className="btn primary"
               href="https://calendly.com/autovexsolutions/30min"
            >
               Book a Call <span className="arrow">&rarr;</span>
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
          <Rise text="From concept to deployment." />{" "}
          <span className="dim">
            <Rise text="We build what's next." offset={2} />
          </span>
        </h2>
        <OrbAnimation />
      </div>

      {/* Desktop (>= 768px): full flow-diagram cards, unchanged */}
      <div className="desktop-only">
        <div className="section-body svc-grid">

          {/* ---------------- Automation ---------------- */}

          <div className="svc lead reveal">
            <div className="svc-col">
              <div className="svc-tag mono">
                <span>01 / Automation</span>
                <span>Core service</span>
              </div>

              <h3>Workflows that run themselves</h3>

              <p>
                We wire your tools together &mdash; CRM, inbox, sheets,
                invoicing &mdash; into pipelines that handle the busywork end to
                end. AI where it helps, deterministic where it matters.
              </p>
            </div>

            <FlowDemo />
          </div>

          {/* ---------------- Web ---------------- */}

          <div className="svc reveal">

            <div className="svc-tag mono">
              <span>02 / Web</span>
            </div>

            <h3>Sites &amp; platforms that sell</h3>

            <p>
              Fast, search-friendly marketing sites and web apps &mdash;
              built to convert, not just to exist.
            </p>

            <WebDemo />

          </div>

          {/* ---------------- Mobile ---------------- */}

          <div className="svc reveal">

            <div className="svc-tag mono">
              <span>03 / Mobile</span>
            </div>

            <h3>Mobile apps built for growth</h3>

            <p>
              High-performance iOS and Android applications engineered for
              speed, scalability and exceptional user experiences.
            </p>

            <MobileDemo />

          </div>

        </div>
      </div>

      {/* Mobile (< 768px): accordion — no flow diagrams, see ServicesAccordion.tsx */}
      <div className="mobile-only">
        <div className="section-body">
          <ServicesAccordion />
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
        {/* Desktop's lede describes the self-running demo loop; mobile has no
            loop/live-typing to describe, so it gets its own accurate copy. */}
        <p className="lede desktop-only">{teardown.body}</p>
        <p className="lede mobile-only">{teardown.bodyMobile}</p>
      </div>

      <div className="desktop-only">
        <div className="section-body reveal">
          <TeardownSketch />
        </div>
      </div>

      <div className="mobile-only">
        <div className="section-body">
          <TeardownCard />
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process">
      <div className="section-head reveal">
        <p className="mono eyebrow">Our process</p>

        <h2 className="rise">
          <Rise text="Built with clarity." />{" "}
          <span className="dim">
            <Rise text="Delivered with precision." offset={2} />
          </span>
        </h2>
      </div>

      <div className="section-body steps">
        {steps.map((step, i) => (
          <div className="step reveal" key={step.title}>
            <span className="mono">
              {String(i + 1).padStart(2, "0")}
            </span>

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
      <CtaIconField />

      <div className="cta-inner reveal">
        <p className="mono eyebrow">Start your next project</p>

        <h2 className="rise">
          <Rise text="Let's create what's next." />
        </h2>

        <p>
          From AI automation and custom software to web platforms and mobile
          applications, we build technology that helps ambitious businesses
          move faster, operate smarter, and scale with confidence.
        </p>

        <div className="cta-row">
          <a className="btn primary" href={contact.bookingUrl}>
            Book a Free Consultation <span className="arrow">&rarr;</span>
          </a>
        </div>

        <p className="alt">
          Prefer email?{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          {" · "}
          <a href={contact.phoneHref}>{contact.phone}</a>
          {" · "}
          <a href={contact.whatsapp} rel="noopener" target="_blank">
            WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  const links = [...getNavLinks(), { href: "#contact", label: "Contact" }];

  return (
    <footer>
      {/* Real text lockup, not the old logo-lockup-white.png: that raster was a
          square canvas with the wordmark stacked under the mark and heavily
          padded, so at any sane footer height the "autovex solutions" text was
          basically illegible. Type is the brand. Independent of Nav's
          .brand-word (icon-beside-text, stacks only below 720px) — this one is
          icon-above-text and centered at every width, by design. */}
      <div className="footer-brand">
        <img
          src="/logo-mark-white.png"
          alt="Autovex Solutions — AI automation, web and mobile app development agency"
          width="56"
          height="56"
          loading="lazy"
        />
        <span className="footer-mark">
          <span>Autovex</span>
          <span>Solutions</span>
        </span>
      </div>

      <div className="footer-socials">
        {socials.map((s) => (
          <a key={s.name} href={s.href} rel="noopener" target="_blank" aria-label={s.name}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </div>

      <nav className="footer-nav" aria-label="Footer">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>

      <p className="footer-bio">{footerBio}</p>

      {/* Rendered as text, not just hrefs: Google Business Profile corroborates
          the phone number against what it can read on the site. */}
      <div className="footer-contact-block">
        <a className="footer-email" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <span className="mono footer-contact">
          <a href={contact.phoneHref}>{contact.phone}</a>
          {" · "}
          <a href={contact.whatsapp} rel="noopener" target="_blank">
            WhatsApp
          </a>
        </span>
      </div>

      <p className="footer-copy mono">
        Copyright &copy; {new Date().getFullYear()} Autovex Solutions. All rights reserved.
      </p>
    </footer>
  );
}
