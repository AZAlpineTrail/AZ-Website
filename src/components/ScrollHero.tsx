"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { TrailSilhouette } from "./TrailSilhouette";

// Phones (portrait or landscape) get a static hero; keep in sync with globals.css.
const STATIC_HERO_QUERY = "(max-width: 767px), (pointer: coarse) and (max-height: 540px)";

export function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const staticHero = window.matchMedia(STATIC_HERO_QUERY);
    let frame = 0;
    const render = () => {
      frame = 0;
      if (staticHero.matches) {
        stage.style.setProperty("--hero-ridge-y", "24%");
        stage.style.setProperty("--hero-cue-opacity", "0");
        return;
      }
      if (prefersReducedMotion) {
        stage.style.setProperty("--hero-ridge-y", "96%");
        stage.style.setProperty("--hero-cue-opacity", "1");
        return;
      }

      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
      const ridgeY = 96 + (24 - 96) * progress;
      const cueOpacity = 1 - Math.min(progress / 0.28, 1);

      stage.style.setProperty("--hero-ridge-y", `${ridgeY}%`);
      stage.style.setProperty("--hero-cue-opacity", String(cueOpacity));
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
  }, [prefersReducedMotion]);

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
      ref={sectionRef}
      id="hero"
      className="az-scroll-hero bg-[#07150f] text-white"
      aria-labelledby="home-hero-title"
      onPointerMove={updateLight}
      onPointerLeave={resetLight}
    >
      <div ref={stageRef} className="az-scroll-hero-stage">
        <div className="az-scroll-hero-image" aria-hidden="true">
          <Image
            src="/azat/images/high-country-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="az-scroll-hero-scrim" aria-hidden="true" />
        <div className="az-scroll-hero-light" aria-hidden="true" />

        <div className="az-scroll-hero-content">
          <h1 id="home-hero-title" className="az-hero-title text-white">
            Ride the
            <span>Arizona Alps</span>
          </h1>
          <Link className="az-hero-route-statement" href="#trail-map">
            704 miles through Eastern Arizona
          </Link>
        </div>

        <div className="az-scroll-hero-cue">
          <span>Follow the trail</span>
          <svg viewBox="0 0 28 36" aria-hidden="true">
            <path d="M14 2v28M4 20l10 10 10-10" />
          </svg>
        </div>

        <p className="az-scroll-hero-credit">Photo © childress.com</p>
        <div className="az-scroll-hero-ridge" aria-hidden="true">
          <TrailSilhouette />
        </div>
      </div>
    </section>
  );
}
