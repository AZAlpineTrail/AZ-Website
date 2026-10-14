"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Fuel, Hotel, Play, Route } from "lucide-react";

import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import type { LeafletRouteMapProps, RouteDayStop } from "@/components/LeafletRouteMap";
import { fallbackRustysRoutePage, type RustysRouteDay, type RustysRoutePageData } from "@/lib/rustys-route";

const LeafletRouteMap = dynamic<LeafletRouteMapProps>(
  () => import("@/components/LeafletRouteMap").then((module) => module.LeafletRouteMap),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#d7ddcf]" aria-label="Loading route map" />,
  },
);

const routeVideos = [
  { day: "01", route: "Alpine to Greer", youtubeId: "rHT5JGnx5Ps" },
  { day: "02", route: "Greer to Show Low", youtubeId: "xwVxz4e7kAU" },
  { day: "03", route: "Show Low to Heber-Overgaard", youtubeId: "iu5ycbuwiI8" },
  { day: "04", route: "Heber-Overgaard to Pine", youtubeId: "qF5sHvpWdjA" },
  { day: "05", route: "Pine to Punkin Center", youtubeId: "egtjfV-EI-Y" },
  { day: "06", route: "Punkin Center to Young", youtubeId: "ZwjQocZXyWA" },
  { day: "07", route: "Young to Heber-Overgaard", youtubeId: "SzEknvyY2r4" },
  { day: "08", route: "Heber-Overgaard to Show Low", youtubeId: "7TN7ccykx88" },
  { day: "09", route: "Show Low to Greer", youtubeId: "jZsEbUxlnOs" },
  { day: "10", route: "Greer to Hannagan Meadow", youtubeId: "Rl_neE4gKiY" },
  { day: "11", route: "Hannagan Meadow to Alpine", youtubeId: "YLZ1xGGkvxM" },
] as const;

const routeDayStops: RouteDayStop[] = [
  { day: "01", route: "Alpine to Greer", coordinates: { lat: 33.93, lng: -109.3 } },
  { day: "02", route: "Greer to Show Low", coordinates: { lat: 34.18, lng: -109.75 } },
  { day: "03", route: "Show Low to Heber-Overgaard", coordinates: { lat: 34.37, lng: -110.31 } },
  { day: "04", route: "Heber-Overgaard to Pine", coordinates: { lat: 34.41, lng: -111.03 } },
  { day: "05", route: "Pine to Punkin Center", coordinates: { lat: 34.14, lng: -111.4 } },
  { day: "06", route: "Punkin Center to Young", coordinates: { lat: 33.99, lng: -111.13 } },
  { day: "07", route: "Young to Heber-Overgaard", coordinates: { lat: 34.26, lng: -110.77 } },
  { day: "08", route: "Heber-Overgaard to Show Low", coordinates: { lat: 34.28, lng: -110.31 } },
  { day: "09", route: "Show Low to Greer", coordinates: { lat: 34.08, lng: -109.75 } },
  { day: "10", route: "Greer to Hannagan Meadow", coordinates: { lat: 33.83, lng: -109.39 } },
  { day: "11", route: "Hannagan Meadow to Alpine", coordinates: { lat: 33.75, lng: -109.23 } },
];

const quietReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function DownloadButton({ cta = fallbackRustysRoutePage.downloadCta }: { cta?: RustysRoutePageData["downloadCta"] }) {
  return (
    <ProtectedDownloadLink
      href={cta?.href || "/downloads/arizona-alpine-trail-gpx"}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b74f32] px-6 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#173d2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] active:translate-y-px"
    >
      <Download size={17} aria-hidden="true" />
      {cta?.label || "Download GPX"}
    </ProtectedDownloadLink>
  );
}

function MobileItineraryRow({ day }: { day: RustysRouteDay }) {
  return (
    <article className="border-b border-[#d8ded4] py-5">
      <div className="flex items-start gap-4">
        <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#b74f32]">{day.day}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-tight text-[#13221a]">{day.route}</h3>
          {day.via ? <p className="mt-1 text-xs font-black uppercase tracking-[0.1em] text-[#9b5d2e]">{day.via}</p> : null}
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[#788278]">
            <Route size={13} aria-hidden="true" />
            Miles
          </dt>
          <dd className="mt-1 font-bold text-[#13221a]">{day.miles}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[#788278]">
            <Fuel size={13} aria-hidden="true" />
            Fuel
          </dt>
          <dd className="mt-1 font-bold text-[#13221a]">{day.fuel}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[#788278]">
            <Hotel size={13} aria-hidden="true" />
            Stay
          </dt>
          <dd className="mt-1 font-bold text-[#13221a]">{day.lodging}</dd>
        </div>
      </dl>
    </article>
  );
}

export function RustysRouteExperience({ data = fallbackRustysRoutePage }: { data?: RustysRoutePageData }) {
  const prefersReducedMotion = useReducedMotion();
  const itineraryDays = data.itineraryDays?.length ? data.itineraryDays : fallbackRustysRoutePage.itineraryDays || [];
  const routeFacts = data.facts?.length ? data.facts : fallbackRustysRoutePage.facts || [];
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const activeVideo = routeVideos[activeVideoIndex];

  function showPreviousVideo() {
    setActiveVideoIndex((current) => (current - 1 + routeVideos.length) % routeVideos.length);
  }

  function showNextVideo() {
    setActiveVideoIndex((current) => (current + 1) % routeVideos.length);
  }

  return (
    <main id="main" className="overflow-hidden bg-[#f8f4e8] text-[#13221a]">
      <section className="px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="mx-auto flex max-w-[1180px] flex-col items-center text-center"
        >
          <motion.h1
            variants={quietReveal}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="font-serif text-[clamp(3.4rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-normal text-[#173d2b]"
          >
            {data.title || "Rusty 1000"}
          </motion.h1>

          <motion.div
            variants={quietReveal}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="mt-9 flex flex-col items-center gap-5 sm:flex-row sm:gap-0"
          >
            {routeFacts.slice(0, 3).map((fact) => (
              <p
                key={fact.label}
                className="px-7 font-mono text-sm font-black uppercase tracking-[0.12em] text-[#334c3f] sm:border-l sm:border-[#c6cec2] sm:first:border-l-0"
              >
                {fact.label}
              </p>
            ))}
          </motion.div>

          <motion.div
            variants={quietReveal}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <DownloadButton cta={data.downloadCta} />
            <a
              href="#videos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#bfc9bc] px-5 text-sm font-black uppercase tracking-[0.1em] text-[#173d2b] transition hover:border-[#b74f32] hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] active:translate-y-px"
            >
              <span className="grid h-4 w-6 place-items-center rounded-[4px] bg-[#e11f3f] text-white" aria-hidden="true">
                <Play size={10} fill="currentColor" strokeWidth={2} />
              </span>
              Watch on YouTube
            </a>
          </motion.div>

        </motion.div>
      </section>

      <section className="px-5 pb-12 sm:px-8 lg:pb-16">
        <div className="mx-auto max-w-[1180px]">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="az-map-experience relative min-h-[430px] overflow-hidden rounded-[6px] border border-[#c7d0c3] bg-[#d7ddcf] sm:min-h-[540px] lg:min-h-[620px]"
          >
            <LeafletRouteMap dayStops={routeDayStops} />
          </motion.div>
        </div>
      </section>

      <section id="itinerary" className="px-5 pb-16 sm:px-8 lg:pb-24">
        <div className="mx-auto max-w-[1180px]">
          <div className="md:hidden">
            {itineraryDays.map((day) => (
              <MobileItineraryRow key={`${day.day}-${day.route}`} day={day} />
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#bfc9bc] font-mono text-[11px] font-black uppercase tracking-[0.16em] text-[#788278]">
                  <th scope="col" className="w-24 py-4 pr-4">Day</th>
                  <th scope="col" className="py-4 pr-4">Route</th>
                  <th scope="col" className="w-28 py-4 pr-4">Miles</th>
                  <th scope="col" className="w-44 py-4 pr-4">Fuel</th>
                  <th scope="col" className="w-48 py-4">Lodging</th>
                </tr>
              </thead>
              <tbody>
                {itineraryDays.map((day) => (
                  <tr key={`${day.day}-${day.route}`} className="border-b border-[#d8ded4] text-[#13221a]">
                    <td className="py-5 pr-4 align-top font-mono text-sm font-black uppercase tracking-[0.12em] text-[#b74f32]">{day.day}</td>
                    <td className="py-5 pr-4 align-top">
                      <p className="text-xl font-semibold leading-tight">{day.route}</p>
                      {day.via ? <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#9b5d2e]">{day.via}</p> : null}
                    </td>
                    <td className="py-5 pr-4 align-top text-base font-bold">{day.miles}</td>
                    <td className="py-5 pr-4 align-top text-base font-semibold text-[#4f5d53]">{day.fuel}</td>
                    <td className="py-5 align-top text-base font-semibold text-[#4f5d53]">{day.lodging}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="videos" className="relative isolate scroll-mt-16 overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <Image
          src={data.heroImage || fallbackRustysRoutePage.heroImage || "/azat/photos/735761389_1318522053829180_4711200860303823554_n.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[#07150f]/72" />

        <div className="mx-auto max-w-[980px]">
          <motion.div
            key={activeVideo.youtubeId}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="text-center"
          >
            <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#f0c477]">Day {activeVideo.day}</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-none text-white sm:text-5xl">{activeVideo.route}</h2>
          </motion.div>

          <div className="relative mt-7 sm:px-14">
            <button
              type="button"
              onClick={showPreviousVideo}
              aria-label="Previous route video"
              className="absolute left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[#fffdf7] text-[#173d2b] shadow-[0_8px_24px_rgba(23,61,43,0.2)] transition hover:bg-[#f0c477] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] active:scale-95 sm:left-0"
            >
              <ChevronLeft size={22} strokeWidth={2} aria-hidden="true" />
            </button>

            <div className="aspect-video overflow-hidden rounded-[6px] bg-[#07150f] shadow-[0_20px_50px_rgba(23,61,43,0.2)]">
              <iframe
                key={activeVideo.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0`}
                title={`Day ${activeVideo.day}: ${activeVideo.route}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="size-full border-0"
              />
            </div>

            <button
              type="button"
              onClick={showNextVideo}
              aria-label="Next route video"
              className="absolute right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[#fffdf7] text-[#173d2b] shadow-[0_8px_24px_rgba(23,61,43,0.2)] transition hover:bg-[#f0c477] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] active:scale-95 sm:right-0"
            >
              <ChevronRight size={22} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <p className="mt-5 text-center font-mono text-xs font-black uppercase tracking-[0.14em] text-white">
            {activeVideoIndex + 1} / {routeVideos.length}
          </p>
        </div>
      </section>
    </main>
  );
}
