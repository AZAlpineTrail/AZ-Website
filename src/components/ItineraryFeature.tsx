"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { HomeItineraryCard } from "@/lib/home";

type ItineraryFeatureProps = {
  title?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  cards?: HomeItineraryCard[];
};

const routeBannerImage = "/azat/ride/ride-overlook.jpg";
const originalRustysImage = "/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg";
const previews: HomeItineraryCard[] = [
  { _key: "preview-forest", title: "Coming soon", image: "/azat/ride/ride-forest.jpg", status: "Coming Soon" },
  { _key: "preview-country", title: "Coming soon", image: "/azat/images/trail-landscape.jpg", status: "Coming Soon" },
  { _key: "preview-aspen", title: "Coming soon", image: "/azat/images/aspen-panorama.jpg", status: "Coming Soon" },
];

/* THESIS: A browseable shelf of rides, extending the map's dark forest surface.
   OWN-WORLD: Real trail photography, paper type, clay accents, small corner radii.
   STORY: Browse itineraries, open Rusty's route, recognize future routes as previews.
   FIRST VIEWPORT: A larger centered photo-and-paper route card with smaller neighbors and controls below.
   FORM: An extension of the existing AZAT field-guide language; manual snap carousel. */
export function ItineraryFeature({
  title = "Rusty 1000",
  image = routeBannerImage,
  imageAlt = "Arizona Alpine Trail terrain along Rusty's route",
  href = "/rustys-route-1000",
  cards = [],
}: ItineraryFeatureProps) {
  const reducedMotion = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean; pointer: number } | null>(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const physicalActive = useRef(0);
  const published = cards.filter((card) => !/coming soon|draft/i.test(card.status || ""));
  const rustyIndex = published.findIndex((card) => /rusty/i.test(`${card.title} ${card.href}`));
  const rusty = rustyIndex >= 0 ? published[rustyIndex] : { title, image, imageAlt, href, miles: "1,000 mi", days: "11 days" };
  const itineraryCards = [rusty, ...published.filter((_, index) => index !== rustyIndex), ...previews];

  const count = itineraryCards.length;
  // Repeated ends keep both neighboring covers visible around the featured ride.
  const displayedCards = [...itineraryCards, ...itineraryCards, ...itineraryCards];

  const scrollToCard = useCallback((index: number, instant = false) => {
    const container = rail.current;
    const card = container?.children[index] as HTMLElement | undefined;
    if (!container || !card) return;
    container.scrollTo({ left: card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2, behavior: instant || reducedMotion ? "instant" : "smooth" });
  }, [reducedMotion]);

  useLayoutEffect(() => {
    physicalActive.current = count;
    scrollToCard(count, true);
  }, [count, scrollToCard]);

  function goTo(index: number) {
    const logicalIndex = (index + count) % count;
    const candidates = [logicalIndex, count + logicalIndex, count * 2 + logicalIndex];
    const closest = candidates.reduce((best, candidate) => Math.abs(candidate - physicalActive.current) < Math.abs(best - physicalActive.current) ? candidate : best);
    scrollToCard(closest);
  }

  function settlePosition() {
    if (drag.current) return;
    const index = physicalActive.current;
    if (index < count || index >= count * 2) scrollToCard(count + index % count, true);
  }

  function syncActive() {
    const container = rail.current;
    if (!container) return;
    const center = container.scrollLeft + container.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    Array.from(container.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const delta = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    physicalActive.current = nearest;
    setActive(nearest % count);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0 || !rail.current) return;
    suppressClick.current = false;
    drag.current = { x: event.clientX, scroll: rail.current.scrollLeft, moved: false, pointer: event.pointerId };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || !rail.current) return;
    if (!(event.buttons & 1)) { endDrag(); return; }
    const delta = event.clientX - gesture.x;
    if (!gesture.moved && Math.abs(delta) < 6) return;
    if (!gesture.moved) {
      gesture.moved = true;
      rail.current.setPointerCapture(event.pointerId);
      rail.current.style.scrollSnapType = "none";
      setDragging(true);
    }
    rail.current.scrollLeft = gesture.scroll - delta;
  }

  function endDrag() {
    const gesture = drag.current;
    if (!gesture || !rail.current) return;
    drag.current = null;
    suppressClick.current = gesture.moved;
    if (rail.current.hasPointerCapture(gesture.pointer)) rail.current.releasePointerCapture(gesture.pointer);
    rail.current.style.scrollSnapType = "";
    setDragging(false);
    if (gesture.moved) goTo(active);
  }

  function respondToPointer(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse" || drag.current?.moved) return;
    const cover = event.currentTarget.querySelector<HTMLElement>(".itinerary-cover");
    if (!cover) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cover.style.setProperty("--tilt-x", `${-y * 4}deg`);
    cover.style.setProperty("--tilt-y", `${x * 4}deg`);
    cover.style.setProperty("--photo-x", `${x * -8}px`);
    cover.style.setProperty("--photo-y", `${y * -8}px`);
  }

  function resetPointer(event: PointerEvent<HTMLElement>) {
    const cover = event.currentTarget.querySelector<HTMLElement>(".itinerary-cover");
    if (!cover) return;
    ["--tilt-x", "--tilt-y", "--photo-x", "--photo-y"].forEach((property) => cover.style.removeProperty(property));
  }

  return (
    <section id="itineraries" aria-labelledby="itineraries-title" aria-roledescription="carousel" className="itinerary-carousel bg-[#07150f] py-12 text-[#fffdf7] sm:py-16">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <h2 id="itineraries-title" className="az-section-title itinerary-heading">Don’t know where to start?</h2>
        <p className="itinerary-intro">Take a look at some ready-made itineraries.</p>
      </div>

      <div className="itinerary-stage">
        <div
          ref={rail}
          className={`itinerary-rail ${dragging ? "is-dragging" : ""}`}
          onScroll={syncActive}
          onScrollEnd={settlePosition}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              goTo((active + (event.key === "ArrowRight" ? 1 : -1) + itineraryCards.length) % itineraryCards.length);
            }
          }}
          tabIndex={0}
          aria-label="Itinerary cards. Swipe or use the left and right arrow keys to browse."
        >
          {displayedCards.map((card, physicalIndex) => {
            const index = physicalIndex % count;
            const duplicate = physicalIndex < count || physicalIndex >= count * 2;
            const comingSoon = /coming soon/i.test(card.status || "");
            const rawImage = card.image || image;
            const cardImage = rawImage === originalRustysImage ? routeBannerImage : rawImage;
            return (
              <article key={`${card._key || card.title}-${physicalIndex}`} className="itinerary-slide" onPointerMove={respondToPointer} onPointerLeave={resetPointer} data-active={index === active} aria-hidden={duplicate || undefined} aria-roledescription="slide" aria-label={`${index + 1} of ${itineraryCards.length}: ${card.title}${comingSoon ? ", future itinerary" : ""}`}>
                <div className={`itinerary-cover group ${comingSoon ? "is-preview" : "is-route"}`}>
                  <div className="itinerary-image-window">
                    <Image src={cardImage} alt={comingSoon ? "" : card.imageAlt || imageAlt} fill sizes="(max-width: 639px) 82vw, 350px" className="itinerary-photo object-cover" draggable={false} />
                  </div>
                  {comingSoon ? <div className="itinerary-teaser-copy">
                    <span className="az-section-title itinerary-question" aria-hidden="true">?</span>
                    <h3 className="az-section-title itinerary-teaser-label">Coming soon</h3>
                  </div> : <div className="itinerary-card-body">
                    <h3 className="az-section-title">{card.title}</h3>
                    {!comingSoon && <>
                      <dl className="itinerary-route-facts">
                        <div><dt>Distance</dt><dd>{(card.miles || "1,000 mi").replace(/\s*mi(?:les)?$/i, "")}<span>mi</span></dd></div>
                        <div><dt>Duration</dt><dd>{(card.days || "11 days").replace(/\s*days?$/i, "")}<span>days</span></dd></div>
                      </dl>
                      <p className="itinerary-start"><MapPin size={16} aria-hidden="true" />Start in <strong>{card.label?.toLowerCase().includes("start in ") ? card.label.replace(/start in /i, "") : "Alpine"}</strong></p>
                      <span className="itinerary-card-action">View itinerary <ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" /></span>
                    </>}
                  </div>}
                  {!comingSoon && <Link href={card.href || href} aria-label={`View ${card.title} itinerary`} tabIndex={duplicate ? -1 : 0} onFocus={() => goTo(index)} className="absolute inset-0 z-10 rounded-[6px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#f1b65a]" />}

                </div>
              </article>
            );
          })}
        </div>
        <div className="itinerary-controls">
        <button type="button" aria-label="Previous itinerary" onClick={() => goTo(active - 1)} className="itinerary-arrow itinerary-arrow-prev"><ChevronLeft size={30} strokeWidth={1.5} aria-hidden="true" /></button>
        <button type="button" aria-label="Next itinerary" onClick={() => goTo(active + 1)} className="itinerary-arrow itinerary-arrow-next"><ChevronRight size={30} strokeWidth={1.5} aria-hidden="true" /></button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Itinerary {active + 1} of {itineraryCards.length}: {itineraryCards[active]?.title}</p>
    </section>
  );
}
