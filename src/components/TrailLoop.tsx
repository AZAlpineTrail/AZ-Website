"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const poster = "/azat/video/azat-loop-poster.jpg";

const description =
  "Riding the Arizona Alpine Trail — canyon river crossings, high-country two-track, and wild horses along the route.";

type TrailLoopProps = {
  className?: string;
};

export function TrailLoop({ className = "" }: TrailLoopProps) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  // Hold the download until the loop is actually on screen, and stop decoding
  // once it scrolls away. Sources stay unset until then via preload="none".
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) video.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // The <source> tags are appended on the render after inView flips, so the
  // element needs an explicit load() before it will pick them up.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !inView || prefersReducedMotion) return;
    if (video.readyState === HTMLMediaElement.HAVE_NOTHING) video.load();
    void video.play().catch(() => {});
  }, [inView, prefersReducedMotion]);

  return (
    <div
      className={`relative isolate aspect-[9/16] max-h-[76svh] w-full overflow-hidden rounded-[6px] bg-[#07150f] shadow-[0_18px_44px_rgba(19,34,26,0.12)] xl:aspect-auto xl:h-full xl:max-h-none ${className}`}
    >
      {prefersReducedMotion ? (
        <Image
          src={poster}
          alt={description}
          fill
          sizes="(min-width: 1280px) 400px, 100vw"
          className="object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          poster={poster}
          preload="none"
          muted
          loop
          playsInline
          autoPlay
          aria-label={description}
        >
          {inView ? (
            <>
              <source src="/azat/video/azat-loop-720.mp4" type="video/mp4" media="(max-width: 480px)" />
              <source src="/azat/video/azat-loop-source.mp4" type="video/mp4" />
            </>
          ) : null}
        </video>
      )}
    </div>
  );
}
