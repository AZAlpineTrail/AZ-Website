"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Mountain } from "lucide-react";

import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import { TrailLoop } from "@/components/TrailLoop";
import { resolveDownloadHref } from "@/lib/download-links";
import type { HomeDownload, HomeMapLayer, HomeTrailHighlight } from "@/lib/home";
import type { LeafletRouteMapProps } from "@/components/LeafletRouteMap";

type TrailMapProps = {
  title?: string;
  copy?: string;
  layers?: HomeMapLayer[];
  highlights?: HomeTrailHighlight[];
  downloads?: HomeDownload[];
};

const LeafletRouteMap = dynamic<LeafletRouteMapProps>(
  () => import("@/components/LeafletRouteMap").then((module) => module.LeafletRouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center bg-[#cad4c2] text-[#173d2b]">
        <div className="rounded-full bg-[#fffdf7]/90 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-xl">
          Loading route map
        </div>
      </div>
    ),
  },
);

export function TrailMap({
  highlights = [],
  downloads = [],
}: TrailMapProps) {
  const prefersReducedMotion = useReducedMotion();
  const quietDownloads = downloads.slice(0, 3);

  return (
    <section id="trail-map" className="az-map-experience relative isolate overflow-hidden bg-[#f4f1e8] text-[#13221a]">
      <div className="mx-auto max-w-[1540px] px-3 py-3 sm:px-5 lg:px-8 xl:py-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-stretch">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          className="relative min-h-[430px] overflow-hidden rounded-[6px] border border-[#cfd7cb] bg-[#cad4c2] shadow-[0_32px_80px_rgba(19,34,26,0.18)] sm:min-h-[520px] xl:min-h-[760px]"
        >
          <div className="relative min-h-[430px] sm:min-h-[520px] xl:min-h-[760px]">
            <LeafletRouteMap highlights={highlights} />
          </div>

          <div className="absolute left-16 top-3 z-[420] sm:left-auto sm:right-3">
            <motion.div whileHover={prefersReducedMotion ? undefined : { y: -2 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}>
              <Link
                href="/trail/3d"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e5b96f] bg-[#173d2b] px-4 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_28px_rgba(19,34,26,0.28)] backdrop-blur transition hover:bg-[#e5b96f] hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5b96f]"
              >
                <Mountain size={14} aria-hidden="true" />
                View in 3D
              </Link>
            </motion.div>
          </div>

          {quietDownloads.length ? (
            <div id="downloads" className="absolute bottom-3 left-3 z-[420] flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
              {quietDownloads.map((download) => (
                <ProtectedDownloadLink
                  key={`${download.label}-${download.href || download.value || ""}`}
                  href={resolveDownloadHref(download.href)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d8ded4] bg-[#fffdf7]/94 px-3.5 text-xs font-black uppercase tracking-[0.1em] text-[#173d2b] shadow-[0_10px_28px_rgba(19,34,26,0.16)] backdrop-blur transition hover:border-[#b74f32] hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
                >
                  <Download size={14} aria-hidden="true" />
                  {download.value || download.label}
                </ProtectedDownloadLink>
              ))}
            </div>
          ) : null}
        </motion.div>

        <div className="relative z-[430] xl:flex xl:min-h-[760px]">
          <TrailLoop />
        </div>
        </div>
      </div>
    </section>
  );
}
