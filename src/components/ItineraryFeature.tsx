"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Route } from "lucide-react";

import type { HomeItineraryCard } from "@/lib/home";

type ItineraryFeatureProps = {
  title?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  cards?: HomeItineraryCard[];
};

const originalRustysImage = "/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg";
const routeBannerImage = "/azat/ride/ride-overlook.jpg";

function getCardId(card: HomeItineraryCard, index: number) {
  return card._key || `${card.title}-${index}`;
}

export function ItineraryFeature({
  title = "Rusty 1000",
  image = routeBannerImage,
  imageAlt = "Arizona Alpine Trail route terrain for Rusty 1000 itinerary",
  href = "/rustys-route-1000",
  cards = [],
}: ItineraryFeatureProps) {
  const prefersReducedMotion = useReducedMotion();
  const fallbackCard = {
    title,
    href,
    label: "Featured itinerary",
    image,
    imageAlt,
    miles: "1,000 mi",
    days: "11 days",
    status: "Available",
  };
  const itineraryCards = cards.length ? cards : [fallbackCard];

  return (
    <section id="itineraries" className="relative overflow-hidden bg-[#fffdf7] px-5 py-12 text-[#13221a] sm:px-8 lg:py-14">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-4">
          {itineraryCards.map((card, index) => {
            const cardHref = card.href || href;
            const rawImage = card.image || image;
            const cardImage = rawImage === originalRustysImage ? routeBannerImage : rawImage;
            const cardImageAlt = card.imageAlt || imageAlt;
            const startLabel = card.label?.toLowerCase().includes("start") ? card.label : "Start in Alpine";
            const facts = [
              { icon: CalendarDays, value: card.days || "11 days" },
              { icon: Route, value: card.miles || "1,000 mi" },
              { icon: MapPin, value: startLabel },
            ];

            return (
              <motion.article
                key={getCardId(card, index)}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.34, ease: "easeOut", delay: prefersReducedMotion ? 0 : index * 0.04 }}
                className="group relative isolate min-h-[250px] overflow-hidden rounded-[6px] bg-[#07150f] shadow-[0_28px_84px_rgba(19,34,26,0.24)] ring-1 ring-[#173d2b]/35 sm:min-h-[270px]"
              >
                <motion.div
                  className="absolute inset-0"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.012 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <Image
                    src={cardImage}
                    alt={cardImageAlt}
                    fill
                    sizes="(min-width: 1024px) 1320px, 100vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,21,15,0.94),rgba(7,21,15,0.76)_38%,rgba(7,21,15,0.16)_78%),linear-gradient(180deg,rgba(7,21,15,0.08),rgba(7,21,15,0.5))]" />

                <div className="relative z-10 grid min-h-[250px] gap-5 p-5 sm:min-h-[270px] sm:p-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,1fr)] lg:items-end lg:p-7">
                  <div>
                    <div className="mb-4 h-1.5 w-24 rounded-full bg-[#b74f32]" />
                    <h2 className="max-w-xl font-serif text-4xl font-semibold leading-[0.92] text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.36)] sm:text-5xl lg:text-6xl">
                      {card.title || title}
                    </h2>
                    <Link
                      href={cardHref}
                      className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#fffdf7] px-6 text-xs font-black uppercase tracking-[0.12em] text-[#13221a] shadow-[0_16px_34px_rgba(0,0,0,0.22)] transition hover:bg-[#f0c477] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      View Itinerary
                      <motion.span whileHover={prefersReducedMotion ? undefined : { x: 2 }} transition={{ duration: 0.18 }} className="inline-flex">
                        <ArrowRight size={15} aria-hidden="true" />
                      </motion.span>
                    </Link>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    {facts.map((fact) => {
                      const Icon = fact.icon;

                      return (
                        <div key={fact.value} className="flex min-h-18 items-center gap-3 rounded-[4px] border border-white/16 bg-[#fffdf7]/94 p-3 text-[#13221a] shadow-[0_18px_38px_rgba(0,0,0,0.24)] backdrop-blur">
                          <Icon className="shrink-0 text-[#9b5d2e]" size={24} aria-hidden="true" />
                          <span className="text-2xl font-black leading-tight sm:text-3xl">{fact.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
