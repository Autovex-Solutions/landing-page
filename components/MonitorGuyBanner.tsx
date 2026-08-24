"use client";

// Full-screen mouse-scrub video interlude between Teardown and Process.
// Reuses the same self-hosted clip as the smaller Teardown panel
// (MonitorGuyBackground.tsx), but at full viewport scale with a
// window-scoped mousemove listener — appropriate here since this section
// genuinely spans the whole screen, unlike that smaller contained panel.
//
// The video itself is position: absolute, scoped to this section, not
// position: fixed like the supplied brief. That brief was a single-page
// site where a fixed background was fine for the page's whole lifetime;
// on this long scrolling page a fixed video would stay pinned to the
// viewport across every section below it, not just this one.
//
// Mobile gets no <video> at all (conditionally mounted, matching the
// Teardown panel's fix) — mouse-scrub can't work on touch, and there's no
// reason to ship 4.5MB for a feature that can't run.
import { useEffect, useRef, useState } from "react";
import { banner, contact } from "@/content";

const SENSITIVITY = 0.8;
const BREAKPOINT = "(min-width: 768px)"; // matches .desktop-only/.mobile-only sitewide

export default function MonitorGuyBanner() {
  const [showButton, setShowButton] = useState(false);
  const [wide, setWide] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mq = matchMedia(BREAKPOINT);
    setWide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // pause the (window-level) scrub listener while the section is scrolled
  // out of view — same reasoning HeroMachine's canvas loop already follows
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !wide) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    io.observe(section);
    return () => io.disconnect();
  }, [wide]);

  useEffect(() => {
    if (!wide || !inView) return;
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let targetTime = 0;
    let isSeeking = false;

    const seekToTarget = () => {
      if (Math.abs(video.currentTime - targetTime) > 0.05) {
        isSeeking = true;
        video.currentTime = targetTime;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      const timeOffset = (delta / innerWidth) * SENSITIVITY * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime + timeOffset));
      if (!isSeeking) seekToTarget();
    };

    const handleSeeked = () => {
      isSeeking = false;
      seekToTarget();
    };

    addEventListener("mousemove", handleMouseMove);
    video.addEventListener("seeked", handleSeeked);
    return () => {
      removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [wide, inView]);

  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email);
  };

  return (
    <section className="mg-banner" ref={sectionRef}>
      {wide && (
        <video
          ref={videoRef}
          src="/monitor-guy.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="mg-banner-video"
        />
      )}
      <div className="mg-banner-inner">
        <p className="mg-banner-label">
          {banner.label[0]}
          <br />
          {banner.label[1]}
        </p>
        <div className={`mg-banner-cta${showButton ? " in" : ""}`}>
          <button type="button" className="mg-banner-btn" onClick={copyEmail}>
            <span>
              Reach us: <span className="mg-banner-email">{contact.email}</span>
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
