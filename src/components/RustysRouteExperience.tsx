"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Fuel, Hotel, Route } from "lucide-react";

import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import type { LeafletRouteMapProps } from "@/components/LeafletRouteMap";
import { fallbackRustysRoutePage, type RustysRouteDay, type RustysRoutePageData } from "@/lib/rustys-route";

const LeafletRouteMap = dynamic<LeafletRouteMapProps>(
  () => import("@/components/LeafletRouteMap").then((module) => module.LeafletRouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center bg-[#cad4c2] text-[#173d2b]">
        <div className="rounded-full bg-[#fffdf7]/92 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] shadow-xl">
          Loading route map
        </div>
      </div>
    ),
  },
);

const imageReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const quietContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const quietReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function DownloadButton({
  cta = fallbackRustysRoutePage.downloadCta,
  className = "",
  colorClassName = "bg-[#e11f3f] text-white hover:bg-[#13221a] focus-visible:outline-[#e11f3f]",
}: {
  cta?: RustysRoutePageData["downloadCta"];
  className?: string;
  colorClassName?: string;
}) {
  return (
    <ProtectedDownloadLink
      href={cta?.href || "/downloads/arizona-alpine-trail-gpx"}
      // colorClassName is a single prop (not merged with structural classes below) so a caller
      // overriding color always fully replaces bg/text/hover — two classes for the same property
      // concatenated via string interpolation don't reliably override each other, since Tailwind's
      // cascade order depends on generation order, not where the class appears in the string.
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black uppercase tracking-[0.1em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${colorClassName} ${className}`}
    >
      <Download size={17} aria-hidden="true" />
      {cta?.label || "Download GPX"}
    </ProtectedDownloadLink>
  );
}

function MobileItineraryRow({ day, reducedMotion }: { day: RustysRouteDay; reducedMotion: boolean | null }) {
  return (
    <motion.article
      variants={quietReveal}
      transition={{ duration: 0.28, ease: "easeOut" }}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="border-t border-[#d8ded4] py-5 first:border-t-0"
    >
      <div className="flex items-start gap-4">
        <span className="font-mono text-sm font-black uppercase tracking-[0.14em] text-[#b74f32]">Day {day.day}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold leading-tight text-[#13221a]">{day.route}</h3>
          {day.via ? <p className="mt-1 text-sm font-black uppercase tracking-[0.1em] text-[#9b5d2e]">{day.via}</p> : null}
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#788278]">
            <Route size={13} aria-hidden="true" />
            Miles
          </dt>
          <dd className="mt-1 font-bold text-[#13221a]">{day.miles}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#788278]">
            <Fuel size={13} aria-hidden="true" />
            Fuel
          </dt>
          <dd className="mt-1 font-bold text-[#13221a]">{day.fuel}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#788278]">
            <Hotel size={13} aria-hidden="true" />
            Stay
          </dt>
          <dd className="mt-1 font-bold text-[#13221a]">{day.lodging}</dd>
        </div>
      </dl>
    </motion.article>
  );
}

export function RustysRouteExperience({ data = fallbackRustysRoutePage }: { data?: RustysRoutePageData }) {
  const prefersReducedMotion = useReducedMotion();
  const routeFacts = data.facts?.length ? data.facts : fallbackRustysRoutePage.facts || [];
  const planningNotes = data.planningNotes?.length ? data.planningNotes : fallbackRustysRoutePage.planningNotes || [];
  const itineraryDays = data.itineraryDays?.length ? data.itineraryDays : fallbackRustysRoutePage.itineraryDays || [];
  const mapHighlights = data.mapHighlights?.length ? data.mapHighlights : fallbackRustysRoutePage.mapHighlights || [];

  return (
    <main className="overflow-hidden bg-[#f8f4e8] text-[#13221a]">
      <section className="relative isolate bg-[#f8f4e8] px-5 pb-5 pt-24 sm:px-8 lg:pt-28">
        <motion.div
          variants={quietContainer}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          className="mx-auto grid min-h-[54svh] max-w-[1320px] content-end gap-5 lg:min-h-[58svh]"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(320px,0.28fr)] lg:items-end">
            <motion.div variants={quietReveal} transition={{ duration: 0.36, ease: "easeOut" }}>
              <p className="az-kicker text-[#9b5d2e]">{data.heroKicker || "Rusty 1000"}</p>
              <h1 className="mt-3 max-w-4xl font-serif text-[clamp(2.7rem,5.8vw,5.8rem)] font-semibold leading-[0.92] tracking-normal text-[#13221a]">
                {data.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f5d53] sm:text-xl">
                {data.heroCopy}
              </p>
            </motion.div>

            <motion.div
              variants={quietReveal}
              transition={{ duration: 0.36, ease: "easeOut" }}
              className="grid gap-3 border-y border-[#d8ded4] py-4 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6"
            >
              {routeFacts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-4 lg:block">
                  <p className="font-mono text-sm font-black uppercase tracking-[0.14em] text-[#b74f32]">{fact.label}</p>
                  <p className="mt-1 text-base font-semibold leading-6 text-[#4f5d53]">{fact.value}</p>
                </div>
              ))}
              <DownloadButton cta={data.downloadCta} className="mt-2 w-full sm:w-auto lg:w-full" />
            </motion.div>
          </div>

          <motion.div
            variants={imageReveal}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="relative h-[18svh] min-h-32 overflow-hidden rounded-[6px] bg-[#173d2b] sm:h-[20svh] lg:h-[22svh]"
          >
            <Image
              src={data.heroImage || fallbackRustysRoutePage.heroImage || "/azat/photos/735761389_1318522053829180_4711200860303823554_n.jpg"}
              alt={data.heroImageAlt || ""}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,21,15,0.28),rgba(7,21,15,0.02)_56%,rgba(7,21,15,0.2))]" />
          </motion.div>
        </motion.div>
      </section>

      <section id="route-overview" className="bg-[#f8f4e8] px-5 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-[1320px]">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 flex flex-col gap-3 px-2 sm:flex-row sm:items-end sm:justify-between sm:px-0"
          >
            <div>
              <p className="az-kicker text-[#9b5d2e]">{data.overviewKicker}</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold leading-none text-[#13221a] sm:text-5xl">{data.overviewTitle}</h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-[#5f6c63]">
              {data.overviewCopy}
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="relative min-h-[420px] overflow-hidden rounded-[6px] border border-[#cfd7cb] bg-[#cad4c2] sm:min-h-[540px] xl:min-h-[680px]"
          >
            <LeafletRouteMap
              highlights={mapHighlights}
              activeFlyTo={false}
              openActivePopup={false}
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f8f4e8] px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-[1320px]">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border-y border-[#d8ded4] py-7"
          >
            <p className="az-kicker text-[#9b5d2e]">{data.planningKicker}</p>
            <div className="mt-7 grid gap-x-10 gap-y-7 md:grid-cols-2">
              {planningNotes.map((note) => (
                <div key={note.label} className="grid gap-2 border-t border-[#d8ded4] pt-5 first:border-t-0 md:first:border-t md:first:pt-5">
                  <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#b74f32]">{note.label}</p>
                  <p className="max-w-xl text-2xl font-semibold leading-snug text-[#13221a]">{note.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="itinerary" className="bg-[#f8f4e8] px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-[1180px]">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-5 border-b border-[#d8ded4] pb-7 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="az-kicker text-[#9b5d2e]">{data.itineraryKicker}</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold leading-none text-[#13221a] sm:text-5xl">{data.itineraryTitle}</h2>
            </div>
            <p className="max-w-xl text-base font-semibold leading-7 text-[#5f6c63]">
              {data.lodgingNote}
            </p>
          </motion.div>

          <motion.div
            variants={quietContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-2 md:hidden"
          >
            {itineraryDays.map((day) => (
              <MobileItineraryRow key={`${day.day}-${day.route}`} day={day} reducedMotion={prefersReducedMotion} />
            ))}
          </motion.div>

          <div className="mt-8 hidden overflow-x-auto md:block">
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
              <motion.tbody
                variants={quietContainer}
                initial={prefersReducedMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                {itineraryDays.map((day) => (
                  <motion.tr
                    key={`${day.day}-${day.route}`}
                    variants={quietReveal}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="border-b border-[#d8ded4] text-[#13221a]"
                  >
                    <td className="py-5 pr-4 align-top font-mono text-sm font-black uppercase tracking-[0.12em] text-[#b74f32]">
                      {day.day}
                    </td>
                    <td className="py-5 pr-4 align-top">
                      <p className="text-xl font-semibold leading-tight">{day.route}</p>
                      {day.via ? <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#9b5d2e]">{day.via}</p> : null}
                    </td>
                    <td className="py-5 pr-4 align-top text-base font-bold">{day.miles}</td>
                    <td className="py-5 pr-4 align-top text-base font-semibold text-[#4f5d53]">{day.fuel}</td>
                    <td className="py-5 align-top text-base font-semibold text-[#4f5d53]">{day.lodging}</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      </section>

      <motion.section
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.36, ease: "easeOut" }}
        className="relative isolate overflow-hidden bg-[#07150f] px-5 py-14 text-white sm:px-8 lg:py-20"
      >
        <Image
          src={data.finalCtaImage || fallbackRustysRoutePage.finalCtaImage || "/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg"}
          alt={data.finalCtaImageAlt || ""}
          fill
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,21,15,0.86),rgba(7,21,15,0.5)_55%,rgba(7,21,15,0.78))]" />
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="az-kicker text-[#f0c477]">{data.finalCtaKicker}</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-none text-white sm:text-5xl">
              {data.finalCtaTitle}
            </h2>
          </div>
          <DownloadButton
            cta={data.downloadCta}
            colorClassName="bg-white text-[#13221a] hover:bg-[#f0c477] hover:text-[#13221a] focus-visible:outline-white"
          />
        </div>
      </motion.section>
    </main>
  );
}
