"use client";

import { useEffect, useRef, useState } from "react";

// Mouse-driven video scrub: horizontal pointer movement scrubs through the
// clip instead of it autoplaying. The original was built full-page (a
// window-level mousemove listener driving a fixed background video); here
// it's one contained panel beside the Teardown heading, so the listener is
// scoped to this component's own container instead — otherwise moving the
// mouse anywhere on the page (e.g. down at the footer) would keep scrubbing
// a video the visitor can't even see.
const SENSITIVITY = 0.8;
// matches the .monitor-guy min-width breakpoint in globals.css
const BREAKPOINT = "(min-width: 1080px)";

export default function MonitorGuyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Starts false so nothing renders during SSR/first paint; the CSS hides
  // this panel below 1080px anyway, but scrubbing needs mouse movement
  // (never fires on touch) and the clip is 4.5MB, so it isn't just
  // decoration to skip below that width — the <video> itself must not
  // mount there or the browser fetches the file regardless of display:none
  // on an ancestor.
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = matchMedia(BREAKPOINT);
    setWide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!wide) return;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

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
      const rect = container.getBoundingClientRect();

      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;

      const timeOffset = (delta / rect.width) * SENSITIVITY * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime + timeOffset));

      if (!isSeeking) seekToTarget();
    };

    const handleEnter = (e: MouseEvent) => {
      prevX = e.clientX;
    };
    const handleLeave = () => {
      prevX = null;
    };
    const handleSeeked = () => {
      isSeeking = false;
      seekToTarget();
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("mouseleave", handleLeave);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [wide]);

  return (
    // Container always renders so the .teardown-head grid's column doesn't
    // shift once `wide` flips true after hydration — only the heavy <video>
    // itself (and therefore its fetch) is deferred.
    <div className="monitor-guy" ref={containerRef}>
      {wide && (
        // self-hosted (was a third-party CloudFront URL scoped to another
        // platform's user session — not something to depend on long-term)
        <video
          ref={videoRef}
          src="/monitor-guy.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="monitor-guy-video"
        />
      )}
    </div>
  );
}
