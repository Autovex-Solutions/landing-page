"use client";

// Full-screen mouse-scrub video banner, now doubling as the Teardown
// section itself (id="teardown") — the pitch/heading/body and the
// interactive pipeline-sketch tool that used to live in their own section
// above this one now live here, per explicit request to consolidate rather
// than show the same pitch twice in a row as the visitor scrolls. The small
// contained video panel that used to sit beside that old section's heading
// (MonitorGuyBackground.tsx) is retired along with it — this section's own
// full-screen video already carries that job.
//
// The video is a fixed-height zone pinned to the top of the section
// (roughly one screen), not stretched across the section's full height —
// the section is now much taller once the sketch tool is included, and a
// video stretched to fill 2000px+ via object-fit: cover would look badly
// over-zoomed. Heading sits over the video zone; the tool sits on the
// section's own solid background once you scroll past it.
import { useEffect, useRef, useState } from "react";
import { teardown } from "@/content";
import { Rise } from "@/components/sections";
import TeardownCard from "@/components/TeardownCard";
import TeardownSketch from "@/components/TeardownSketch";

const SENSITIVITY = 0.8;
const BREAKPOINT = "(min-width: 768px)"; // matches .desktop-only/.mobile-only sitewide

export default function MonitorGuyBanner() {
  const [wide, setWide] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = matchMedia(BREAKPOINT);
    setWide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // pause the (window-level) scrub listener while the video zone is
  // scrolled out of view — same reasoning HeroMachine's canvas loop follows
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
    <section id="teardown" className="mg-banner">
      <div className="mg-banner-video-wrap">
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
      </div>

      <div className="section-head reveal">
        <p className="mono eyebrow">{teardown.eyebrow}</p>
        <h2 className="rise">
          <Rise text={teardown.heading} />{" "}
          <span className="dim">
            <Rise text={teardown.headingDim} offset={4} />
          </span>
        </h2>
        {/* Desktop's lede describes the self-running demo loop; mobile has
            no loop/live-typing to describe, so it gets its own accurate
            copy. */}
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
