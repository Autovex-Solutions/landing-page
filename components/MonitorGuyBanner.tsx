"use client";

// Two stacked sections that used to be one (see git history for the merged
// version). The full-bleed mouse-scrub video stays here, one screen tall,
// carrying a short pitch (.mg-hero) — the "send us your worst workflow"
// teardown pitch + lead-capture card live in their own section right below
// it (.mg-workflow, id="teardown"), on solid background with no video
// behind it. The interactive pipeline-sketch demo that used to sit there
// (TeardownSketch.tsx) was deleted; TeardownCard is now used at every width.
import { useEffect, useRef, useState } from "react";
import { monitorGuyHero, teardown } from "@/content";
import { Rise } from "@/components/sections";
import TeardownCard from "@/components/TeardownCard";

const SENSITIVITY = 0.8;
// below this the hero is a single stacked column covering the video anyway,
// so there's no point fetching/mounting it
const BREAKPOINT = "(min-width: 1024px)";

export default function MonitorGuyBanner() {
  const [wide, setWide] = useState(false);
  const [inView, setInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = matchMedia(BREAKPOINT);
    setWide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // pause the (window-level) scrub listener while the video is scrolled
  // out of view — same reasoning HeroMachine's canvas loop follows
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !wide) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    io.observe(video);
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

  return (
    <>
      <section className="mg-hero" aria-labelledby="mg-hero-heading">
        <div className="mg-hero-video-wrap">
          {wide && (
            <video
              ref={videoRef}
              src="/monitor-guy.mp4"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              className="mg-hero-video"
            />
          )}
        </div>

        <div className="mg-hero-content reveal">
          <h2 id="mg-hero-heading" className="rise mg-hero-heading">
            <Rise text={monitorGuyHero.heading} />
          </h2>
          <p className="mg-hero-subtext">{monitorGuyHero.subtext}</p>
        </div>
      </section>

      <section id="teardown" className="mg-workflow" aria-label="Free teardown">
        <div className="mg-workflow-grid">
          <div className="section-head reveal">
            <p className="mono eyebrow">{teardown.eyebrow}</p>
            <h2 className="rise">
              <Rise text={teardown.heading} />{" "}
              <span className="dim">
                <Rise text={teardown.headingDim} offset={4} />
              </span>
            </h2>
            {/* Full pitch on desktop; mobile gets the input box front and
                center with a one-line reason to use it, not a paragraph
                to read first — same desktop-only/mobile-only split used
                elsewhere (see that class comment in globals.css). */}
            <p className="lede desktop-only">{teardown.body}</p>
            <p className="lede td-lede-mobile mobile-only">
              Get an engineered estimate in 48 hours.
            </p>
          </div>

          <div className="section-body">
            <TeardownCard />
          </div>
        </div>
      </section>
    </>
  );
}
