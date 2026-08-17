"use client";

import { useEffect, useState } from "react";
import { workItems } from "@/content";

// Sticky glass nav. Transparent over the hero; after ~10px of scroll it
// condenses into a floating glass bar. Mobile: burger → full-height sheet
// (body scroll locked while open, Escape closes).
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 10);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { href: "#services", label: "Services" },
    ...(workItems.length > 0 ? [{ href: "#work", label: "Work" }] : []),
    { href: "#teardown", label: "Teardown" },
    { href: "#process", label: "Process" },
  ];

  return (
    <div className={`site-nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <nav>
        <a className="brand" href="#" onClick={() => setOpen(false)}>
          {/* ponytail: plain img — logo is a tiny png, next/image adds nothing here */}
          <img src="/logo-mark-white.png" alt="Autovex Solutions logo" width="34" height="34" />
          <span className="brand-full">AUTOVEX SOLUTIONS</span>
          <span className="brand-short">AUTOVEX</span>
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a className="solid" href="#contact">
            Book a call
          </a>
        </div>
        <button
          className="nav-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </nav>
      <div className="nav-sheet" role="dialog" aria-label="Site menu">
        <div className="nav-sheet-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <a className="btn primary" href="#contact" onClick={() => setOpen(false)}>
          Book a call <span className="arrow">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
