"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Droplet,
  Fuel,
  Hotel,
  MapPin,
  ParkingCircle,
  ShieldAlert,
  ShowerHead,
  Stethoscope,
  Utensils,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import { Lightbox, PhotoGallery } from "@/components/PhotoGallery";
import type { SegmentRouteMapProps } from "@/components/SegmentRouteMap";
import { getTrailSegmentDisplayNumber, trailSegmentIndex } from "@/lib/trail-segment-index";
import type { TrailSegmentNeighbor, TrailSegmentPageData } from "@/lib/trail-segments";

const SegmentRouteMap = dynamic<SegmentRouteMapProps>(
  () => import("@/components/SegmentRouteMap").then((module) => module.SegmentRouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center bg-[#cad4c2] text-[#173d2b]">
        <div className="rounded-full bg-[#fffdf7]/92 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] shadow-xl">
          Loading segment map
        </div>
      </div>
    ),
  },
);

const trailRatingLabels: Record<string, string> = {
  "easier-green": "Easier / Green",
  "more-difficult-blue": "More Difficult / Blue",
  "most-difficult-black": "Most Difficult / Black",
};

const amenityIcons: Record<string, LucideIcon> = {
  Food: Utensils,
  Fuel: Fuel,
  Lodging: Hotel,
  Medical: Stethoscope,
  "Potable Water": Droplet,
  Restroom: ShowerHead,
  "Parking/Staging": ParkingCircle,
  Repair: Wrench,
};

const allAmenityCategories = Object.keys(amenityIcons);

function normalizeParagraphs(body: unknown): string[] {
  if (!body) return [];
  if (typeof body === "string") return body.split("\n\n").filter(Boolean);
  if (Array.isArray(body)) {
    return body
      .filter((block): block is { _type: string; children?: { text?: string }[] } => Boolean(block) && typeof block === "object" && "_type" in block && block._type === "block")
      .map((block) => (block.children ?? []).map((child) => child.text ?? "").join(""))
      .filter(Boolean);
  }
  return [];
}

function NeighborLink({ neighbor, direction }: { neighbor: TrailSegmentNeighbor; direction: "prev" | "next" }) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  const label = direction === "prev" ? "Previous segment" : "Next segment";

  if (!neighbor) {
    return <div className="min-h-11 flex-1" />;
  }

  const content = (
    <>
      {direction === "prev" ? <Icon size={16} aria-hidden="true" /> : null}
      <span className="min-w-0">
        <span className="block font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#9b5d2e]">{label}</span>
        <span className="block truncate text-base font-semibold">{neighbor.name}</span>
      </span>
      {direction === "next" ? <Icon size={16} aria-hidden="true" /> : null}
    </>
  );

  if (!neighbor.published) {
    return (
      <div
        className={`flex min-h-11 flex-1 items-center gap-2 rounded-sm border border-[#d8ded4] px-4 py-2 text-[#9aa39a] ${
          direction === "next" ? "justify-end text-right" : ""
        }`}
        title={`${neighbor.name} isn't published yet`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/trail/${neighbor.slug}`}
      className={`flex min-h-11 flex-1 items-center gap-2 rounded-sm border border-[#d8ded4] bg-[#fffdf7] px-4 py-2 text-[#13221a] transition hover:border-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] ${
        direction === "next" ? "justify-end text-right" : ""
      }`}
    >
      {content}
    </Link>
  );
}

export function TrailSegmentExperience({
  data,
  prev,
  next,
}: {
  data: TrailSegmentPageData;
  prev: TrailSegmentNeighbor;
  next: TrailSegmentNeighbor;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [mapLightboxOpen, setMapLightboxOpen] = useState(false);
  const paragraphs = normalizeParagraphs(data.descriptionBody);
  const photos = [
    data.heroImage ? { url: data.heroImage, alt: data.heroImageAlt } : null,
    ...(data.gallery ?? []),
  ].filter((photo): photo is { url?: string; alt?: string } => Boolean(photo?.url));
  const gpxId = trailSegmentIndex.find((entry) => entry.number === data.segmentNumber)?.gpxId;
  const primaryDownload = data.downloads?.[0];
  const downloadHref = primaryDownload?.slug?.current ? `/downloads/${primaryDownload.slug.current}` : "/downloads/arizona-alpine-trail-gpx";

  const facts = [
    { label: "Length", value: data.lengthMiles != null ? `${data.lengthMiles} mi` : "—" },
    { label: "Min Elevation", value: data.minElevationFeet != null ? `${data.minElevationFeet.toLocaleString()} ft` : "—" },
    { label: "Max Elevation", value: data.maxElevationFeet != null ? `${data.maxElevationFeet.toLocaleString()} ft` : "—" },
    { label: "Trail Rating", value: data.trailRating ? trailRatingLabels[data.trailRating] ?? data.trailRating : "Unrated" },
    { label: "Gain", value: data.elevationGainFeet != null ? `${data.elevationGainFeet.toLocaleString()} ft` : "—" },
    { label: "Loss", value: data.elevationLossFeet != null ? `${data.elevationLossFeet.toLocaleString()} ft` : "—" },
  ];

  return (
    <main className="overflow-hidden bg-[#f8f4e8] text-[#13221a]">
      <section className="relative isolate bg-[#08130d] px-5 pb-8 pt-28 text-white sm:px-8 lg:pt-32">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          className="mx-auto w-full max-w-[1320px]"
        >
          <p className="az-kicker text-[#f1b65a]">
            Segment {getTrailSegmentDisplayNumber(data.segmentNumber).toString().padStart(2, "0")} · {data.status ?? "Status pending"}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.6rem,6vw,5.6rem)] font-semibold leading-[0.92] text-white">
            {data.title}
          </h1>
        </motion.div>
      </section>

      {photos.length ? (
        <section className="bg-[#08130d] pb-5">
          <PhotoGallery photos={photos as { url: string; alt?: string }[]} title={data.title} />
        </section>
      ) : (
        <section className="bg-[#08130d] px-5 pb-8 sm:px-8">
          <p className="mx-auto max-w-[1320px] text-sm font-semibold text-white/60">Photos for this segment are on the way.</p>
        </section>
      )}

      <section className="bg-[#173d2b] px-5 py-6 sm:px-8">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-sm bg-white/5 px-3 py-3">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#f1b65a]">{fact.label}</p>
              <p className="mt-1 text-lg font-bold leading-tight text-white">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f8f4e8] px-5 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-[1320px]">
          {data.mapImage ? (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="mx-auto w-full max-w-[280px] sm:max-w-xs"
            >
              <button
                type="button"
                onClick={() => setMapLightboxOpen(true)}
                aria-label={`View full size: ${data.mapImageAlt || `${data.title} route map`}`}
                className="group block w-full overflow-hidden rounded-[6px] border border-[#cfd7cb]"
              >
                <Image
                  src={data.mapImage}
                  alt={data.mapImageAlt || `${data.title} route map`}
                  width={1105}
                  height={1490}
                  sizes="280px"
                  className="h-auto w-full bg-[#f4f1e8] transition duration-300 group-hover:scale-[1.02]"
                />
              </button>
              {mapLightboxOpen ? (
                <Lightbox
                  photos={[{ url: data.mapImage, alt: data.mapImageAlt }]}
                  index={0}
                  onClose={() => setMapLightboxOpen(false)}
                  onNavigate={() => {}}
                />
              ) : null}
            </motion.div>
          ) : gpxId ? (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="relative min-h-[360px] overflow-hidden rounded-[6px] border border-[#cfd7cb] bg-[#cad4c2] sm:min-h-[440px]"
            >
              <SegmentRouteMap segmentId={gpxId} label={data.title} />
            </motion.div>
          ) : null}
        </div>
      </section>

      <section className="bg-[#f8f4e8] px-5 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
          <div className="grid gap-5">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="max-w-2xl text-base leading-8 text-[#3c453f] sm:text-lg">
                {paragraph}
              </p>
            ))}

            {data.pointsOfInterest?.length ? (
              <div className="mt-4">
                <p className="az-kicker text-[#9b5d2e]">Points of interest</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {data.pointsOfInterest.map((place) => (
                    <li
                      key={place}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#d8ded4] bg-[#fffdf7] px-3 py-1.5 text-sm font-semibold text-[#13221a]"
                    >
                      <MapPin size={13} aria-hidden="true" className="text-[#b74f32]" />
                      {place}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="grid gap-5">
            {data.amenities?.length ? (
              <div className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
                <p className="az-kicker text-[#9b5d2e]">Amenities nearby</p>
                <ul className="mt-4 grid grid-cols-2 gap-3">
                  {allAmenityCategories.map((category) => {
                    const Icon = amenityIcons[category];
                    const active = data.amenities?.includes(category);
                    return (
                      <li
                        key={category}
                        className={`flex items-center gap-2 text-sm font-semibold ${active ? "text-[#13221a]" : "text-[#c3cabf]"}`}
                      >
                        <Icon size={16} aria-hidden="true" className={active ? "text-[#b74f32]" : "text-[#c3cabf]"} />
                        {category}
                      </li>
                    );
                  })}
                </ul>
                {data.amenitiesNote ? <p className="mt-4 text-sm leading-6 text-[#5f6c63]">{data.amenitiesNote}</p> : null}
              </div>
            ) : null}

            {data.safetyNote ? (
              <div className="rounded-sm bg-[#f5e6d3] p-5">
                <p className="flex items-center gap-2 az-kicker text-[#9b5d2e]">
                  <ShieldAlert size={16} aria-hidden="true" />
                  Safety note
                </p>
                <p className="mt-3 text-sm leading-6 text-[#4a3a26]">{data.safetyNote}</p>
              </div>
            ) : null}

            <ProtectedDownloadLink
              href={downloadHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e11f3f] px-5 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11f3f]"
            >
              <Download size={17} aria-hidden="true" />
              Download GPX
            </ProtectedDownloadLink>

            {data.lastVerifiedAt ? (
              <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#788278]">
                Last verified{" "}
                {new Date(`${data.lastVerifiedAt}T00:00:00`).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d8ded4] bg-[#f8f4e8] px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 sm:flex-row">
          <NeighborLink neighbor={prev} direction="prev" />
          <NeighborLink neighbor={next} direction="next" />
        </div>
      </section>
    </main>
  );
}
