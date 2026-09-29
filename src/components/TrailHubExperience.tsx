"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Box, Download, Search, X } from "lucide-react";

import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import type { TrailTerrainMapProps } from "@/components/TrailTerrainMap";
import { downloads as fullTrailDownloads } from "@/lib/content";
import { getTrailSegmentDisplayNumber } from "@/lib/trail-segment-index";
import type { TrailHubSegment } from "@/lib/trail-segments";

const ratingLabels: Record<string, string> = {
  "easier-green": "Green",
  "more-difficult-blue": "Blue",
  "most-difficult-black": "Black",
};

type DifficultyFilter = "all" | "easier-green" | "more-difficult-blue" | "most-difficult-black" | "unrated";
type MileageFilter = "all" | "under-20" | "20-35" | "35-plus";

const difficultyOptions: { value: DifficultyFilter; label: string }[] = [
  { value: "all", label: "Any difficulty" },
  { value: "easier-green", label: "Green" },
  { value: "more-difficult-blue", label: "Blue" },
  { value: "most-difficult-black", label: "Black" },
  { value: "unrated", label: "Unrated" },
];

const mileageOptions: { value: MileageFilter; label: string }[] = [
  { value: "all", label: "Any mileage" },
  { value: "under-20", label: "Under 20 mi" },
  { value: "20-35", label: "20–35 mi" },
  { value: "35-plus", label: "35+ mi" },
];

function matchesDifficulty(segment: TrailHubSegment, filter: DifficultyFilter) {
  if (filter === "all") return true;
  if (filter === "unrated") return !segment.trailRating;
  return segment.trailRating === filter;
}

function matchesMileage(segment: TrailHubSegment, filter: MileageFilter) {
  if (filter === "all") return true;
  if (segment.distanceMiles == null) return false;
  if (filter === "under-20") return segment.distanceMiles < 20;
  if (filter === "20-35") return segment.distanceMiles >= 20 && segment.distanceMiles <= 35;
  return segment.distanceMiles > 35;
}

const TrailTerrainMap = dynamic<TrailTerrainMapProps>(
  () => import("@/components/TrailTerrainMap").then((module) => module.TrailTerrainMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center bg-[#08130d] text-white">
        <div className="rounded-full bg-white/8 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white/78 shadow-xl">
          Loading terrain
        </div>
      </div>
    ),
  },
);

export function TrailHubExperience({ segments }: { segments: TrailHubSegment[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | undefined>(
    () => segments.find((s) => s.published)?.gpxId ?? segments[0]?.gpxId,
  );
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [mileageFilter, setMileageFilter] = useState<MileageFilter>("all");
  const [search, setSearch] = useState("");

  const filteredSegments = segments.filter(
    (item) =>
      matchesDifficulty(item, difficultyFilter) &&
      matchesMileage(item, mileageFilter) &&
      item.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <main id="main" className="overflow-hidden bg-[#f8f4e8] text-[#13221a]">
      <section className="relative isolate bg-[#08130d] px-5 pb-10 pt-28 text-white sm:px-8 lg:pt-32">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          className="mx-auto max-w-[1320px]"
        >
          <p className="az-kicker text-[#f1b65a]">The full trail</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.6rem,5.6vw,5.4rem)] font-semibold leading-[0.94] text-white">
            28 segments. One 674-mile loop.
          </h1>
        </motion.div>
      </section>

      <section className="bg-[#f8f4e8] px-5 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {fullTrailDownloads.map((item) => (
              <ProtectedDownloadLink
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#173d2b] px-4 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
              >
                <Download size={15} aria-hidden="true" />
                {item.label}
              </ProtectedDownloadLink>
            ))}
          </div>
          <Link
            href="/trail/3d"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#b87939] px-4 text-xs font-black uppercase tracking-[0.1em] text-[#9b5d2e] transition hover:bg-[#b87939] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b87939]"
          >
            <Box size={15} aria-hidden="true" />
            Open full-screen 3D view
          </Link>
        </div>
      </section>

      <section id="segments" className="bg-[#f8f4e8] px-5 pb-16 sm:px-8 lg:pb-20 scroll-mt-24">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-stretch">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="relative min-h-[440px] overflow-hidden rounded-[6px] border border-[#cfd7cb] bg-[#08130d] sm:min-h-[560px] lg:min-h-[680px]"
            >
              <TrailTerrainMap embedded activeSegmentId={activeId} onSegmentSelect={setActiveId} />
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="flex min-h-[440px] flex-col overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] sm:min-h-[560px] lg:min-h-[680px]"
            >
              <div className="flex flex-col gap-2 border-b border-[#d8ded4] bg-[#fffdf7] p-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa39a]" aria-hidden="true" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search segments"
                    aria-label="Search segments by name"
                    className="min-h-10 w-full rounded-full border border-[#d8ded4] bg-[#fffdf7] py-2 pl-9 pr-8 text-sm text-[#13221a] outline-none transition placeholder:text-[#9aa39a] focus:border-[#b74f32]"
                  />
                  {search ? (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-[#9aa39a] transition hover:bg-[#f0ede0] hover:text-[#13221a]"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <select
                    value={difficultyFilter}
                    onChange={(event) => setDifficultyFilter(event.target.value as DifficultyFilter)}
                    aria-label="Filter by difficulty"
                    className="min-h-10 flex-1 rounded-full border border-[#d8ded4] bg-[#fffdf7] px-3 text-xs font-bold text-[#13221a] outline-none transition focus:border-[#b74f32] sm:flex-none"
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={mileageFilter}
                    onChange={(event) => setMileageFilter(event.target.value as MileageFilter)}
                    aria-label="Filter by mileage"
                    className="min-h-10 flex-1 rounded-full border border-[#d8ded4] bg-[#fffdf7] px-3 text-xs font-bold text-[#13221a] outline-none transition focus:border-[#b74f32] sm:flex-none"
                  >
                    {mileageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ul className="flex-1 overflow-y-auto">
                {filteredSegments.map((item) => {
                  const isActive = item.gpxId === activeId;
                  return (
                    <li key={item.gpxId} className="border-b border-[#ece7d8] last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setActiveId(item.gpxId)}
                        aria-current={isActive ? "true" : undefined}
                        className={`flex w-full items-center gap-3 px-3 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] ${
                          isActive ? "bg-[#f0ede0]" : "hover:bg-[#f5f2e6]"
                        }`}
                      >
                        <span className="w-6 shrink-0 font-mono text-xs font-black text-[#b74f32]">
                          {getTrailSegmentDisplayNumber(item.number).toString().padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-base font-semibold text-[#13221a]">{item.name}</span>
                        <span className="shrink-0 font-mono text-[11px] font-bold text-[#5f6c63]">
                          {item.trailRating ? ratingLabels[item.trailRating] ?? "Unrated" : "Unrated"}
                        </span>
                        <span className="w-14 shrink-0 text-right font-mono text-[11px] font-bold text-[#5f6c63]">
                          {item.distanceMiles != null ? `${item.distanceMiles} mi` : "—"}
                        </span>
                      </button>
                      {isActive && item.published ? (
                        <div className={`px-3 pb-3 ${isActive ? "bg-[#f0ede0]" : ""}`}>
                          <Link
                            href={`/trail/${item.slug}`}
                            className="ml-9 inline-flex min-h-8 w-fit items-center gap-1.5 rounded-full bg-[#173d2b] px-3 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
                          >
                            View segment
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </Link>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
                {filteredSegments.length === 0 ? (
                  <li className="px-3 py-8 text-center text-sm font-semibold text-[#9aa39a]">No segments match those filters.</li>
                ) : null}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
