"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { TrailSilhouette } from "./TrailSilhouette";

// Phones (portrait or landscape) get a static hero; keep in sync with globals.css.
const STATIC_HERO_QUERY = "(max-width: 767px), (pointer: coarse) and (max-height: 540px)";
const HERO_STAGE_DRIFT = 0.12;
// Keep the static CSS resting position in sync with this gentle tree reveal.
const HERO_RIDGE_REST_Y = 29;

// Keep the original tree treatment available: <ScrollHero showTrees />.
export function ScrollHero({ showTrees = false }: { showTrees?: boolean } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setVideoEnabled(!motion.matches);
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!videoEnabled || !video || !stage) return;
    let inView = true;
    const syncPlayback = () => {
      if (inView && !document.hidden) {
        video.play().catch(() => setVideoEnabled(false));
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.05 });
    observer.observe(stage);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [videoEnabled]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || !showTrees) return;

    const staticHero = window.matchMedia(STATIC_HERO_QUERY);
    let frame = 0;
    const render = () => {
      frame = 0;
      if (staticHero.matches) {
        stage.style.setProperty("--hero-ridge-y", `${HERO_RIDGE_REST_Y}%`);
        stage.style.setProperty("--hero-stage-y", "0px");
        return;
      }
      if (prefersReducedMotion) {
        stage.style.setProperty("--hero-ridge-y", `${HERO_RIDGE_REST_Y}%`);
        stage.style.setProperty("--hero-stage-y", "0px");
        return;
      }

      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
      const ridgeY = 96 + (HERO_RIDGE_REST_Y - 96) * progress;
      const stageY = -window.innerHeight * HERO_STAGE_DRIFT * progress;

      stage.style.setProperty("--hero-ridge-y", `${ridgeY}%`);
      stage.style.setProperty("--hero-stage-y", `${stageY}px`);
    };
    const requestRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender, { passive: true });
    staticHero.addEventListener("change", requestRender);
    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      staticHero.removeEventListener("change", requestRender);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion, showTrees]);

  const updateLight = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || !stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    stageRef.current.style.setProperty("--hero-light-x", `${x}%`);
    stageRef.current.style.setProperty("--hero-light-y", `${y}%`);
  };

  const resetLight = () => {
    stageRef.current?.style.setProperty("--hero-light-x", "50%");
    stageRef.current?.style.setProperty("--hero-light-y", "48%");
  };

  return (
    <section
      id="hero"
      data-trees={showTrees}
      className="az-scroll-hero bg-[#07150f] text-white"
      aria-labelledby="home-hero-title"
      onPointerMove={updateLight}
      onPointerLeave={resetLight}
    >
      <div ref={sectionRef} className="az-scroll-hero-track">
        <div ref={stageRef} className="az-scroll-hero-stage">
          <div className="az-scroll-hero-image" aria-hidden="true">
            <Image
              src="/azat/video/autumn-hero-poster.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {videoEnabled && <video
              ref={videoRef}
              className="az-hero-video"
              src="/azat/video/autumn-hero.mp4"
              poster="/azat/video/autumn-hero-poster.jpg"
              muted
              loop
              playsInline
              preload="none"
              onError={() => setVideoEnabled(false)}
              tabIndex={-1}
            />}
          </div>
          <div className="az-scroll-hero-scrim" aria-hidden="true" />
          <div className="az-scroll-hero-light" aria-hidden="true" />

          <div className="az-scroll-hero-content">
            <h1 id="home-hero-title" className="az-hero-title text-white">
              Ride the{" "}
              <span>
                Arizona <span className="az-hero-title-keep">High Pines</span>
              </span>
            </h1>
            <Link className="az-hero-route-statement" href="#trail-intro">
              Discover the Trail ↓
            </Link>
          </div>

          {showTrees ? <div className="az-scroll-hero-ridge" aria-hidden="true">
            <TrailSilhouette />
          </div> : <div className="az-hero-handoff" aria-hidden="true" />}
        </div>
      </div>

      <div id="trail-intro" className="az-hero-supporting-panel">
        <p className="az-hero-supporting-copy">
          <span className="az-hero-supporting-lead">
            Explore high-country OHV routes along Arizona&rsquo;s most scenic alpine corridor.
          </span>
          <span className="az-hero-supporting-detail">
            Discover mountain towns offering fuel, food, and lodging along the way.
          </span>
        </p>
      </div>
    </section>
  );
}
