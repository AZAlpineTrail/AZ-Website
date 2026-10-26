"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Download, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useFocusTrap } from "@/lib/useFocusTrap";

const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=Payson+Public+Library+328+N+McLane+Rd+Payson+AZ";
// End of event day in Arizona time (MST, no DST); the announcement disappears after this.
const EVENT_ENDS_AT = new Date("2026-10-29T23:59:59-07:00").getTime();
const SEEN_KEY = "azat-event-payson-2026-10-29-seen";
const noopSubscribe = () => () => {};

export function UpcomingEvent() {
  // Decided on the client (false on the server) so a cached page never shows the event after it ends.
  const active = useSyncExternalStore(noopSubscribe, () => Date.now() <= EVENT_ENDS_AT, () => false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useFocusTrap(dialogRef, open, { autoFocus: true, restoreFocus: true });

  // Auto-opens once per browser session; the pill reopens it after that.
  useEffect(() => {
    if (!active) return;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    if (seen) return;

    const timer = window.setTimeout(() => setOpen(true), 650);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!active) return null;

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-[#07150f]/78 px-0 backdrop-blur-[3px] sm:items-center sm:px-5 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="payson-event-title"
              aria-describedby="payson-event-summary"
              className="relative grid max-h-[94dvh] w-full max-w-[980px] overflow-y-auto rounded-t-[10px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.42)] sm:max-h-[92vh] sm:rounded-[6px] md:grid-cols-[0.72fr_1.28fr] md:overflow-hidden"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.99 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close event announcement"
                className="absolute right-3 top-3 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/16 bg-[#07150f]/82 text-white shadow-[0_10px_28px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl backdrop-saturate-150 transition hover:border-white/30 hover:bg-[#102a1e]/92 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07150f]"
              >
                <X size={21} aria-hidden="true" />
              </button>

              <div className="flex flex-col px-6 pb-7 pt-16 sm:px-9 sm:pb-9 sm:pt-14 md:min-h-0 md:justify-center md:overflow-y-auto md:border-r md:border-[#d8ded4] md:px-8 md:py-8">
                <h2
                  id="payson-event-title"
                  className="font-serif text-[2rem] font-semibold leading-[1.05] text-[#13221a] sm:text-[2.25rem]"
                >
                  How the Arizona Alpine Trail can grow your business
                </h2>
                <div id="payson-event-summary" className="mt-7 space-y-5 border-t border-[#d8ded4] pt-6 text-[#13221a]">
                  <p className="flex gap-3 text-sm leading-6">
                    <CalendarDays className="mt-0.5 shrink-0 text-[#b74f32]" size={18} aria-hidden="true" />
                    <span><strong className="block text-base">October 29, 2026</strong>11:00 AM · Light lunch provided</span>
                  </p>
                  <p className="flex gap-3 text-sm leading-6">
                    <MapPin className="mt-0.5 shrink-0 text-[#b74f32]" size={18} aria-hidden="true" />
                    <span><strong className="block text-base">Payson Public Library</strong>Mogollon Room<br />328 N. McLane Rd., Payson</span>
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-3">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-[#173d2b] px-5 text-sm font-bold text-white transition hover:bg-[#24563e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
                  >
                    <MapPin size={17} aria-hidden="true" />
                    Get directions
                  </a>
                  <a
                    href="/azat/events/payson-business-meeting.pdf"
                    download
                    className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-[#173d2b] underline decoration-[#173d2b]/30 underline-offset-4 transition hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
                  >
                    <Download size={17} aria-hidden="true" />
                    Download flyer
                  </a>
                </div>
              </div>

              <div className="relative min-h-[610px] overflow-hidden bg-[#ece9e1] p-4 sm:p-6 md:flex md:min-h-0 md:items-center md:justify-center md:p-7">
                <Image
                  src="/azat/events/payson-business-meeting.webp"
                  alt="Event flyer for the Arizona Alpine Trail business meeting in Payson on October 29, 2026"
                  width={1190}
                  height={1540}
                  priority
                  className="mx-auto h-auto w-full max-w-[580px] rounded-[3px] shadow-[0_18px_44px_rgba(24,39,29,0.24)] md:max-h-[calc(92vh-64px)] md:w-auto md:object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!open ? (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-4 z-[65] inline-flex min-h-14 items-center gap-3 rounded-full border border-white/16 bg-[#07150f]/74 px-5 font-mono text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl backdrop-saturate-150 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-[#102a1e]/82 hover:shadow-[0_14px_36px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-6 sm:left-6"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.24 }}
        >
          <span className="inline-flex text-white">
            <CalendarDays size={19} aria-hidden="true" />
          </span>
          Payson event · Oct 29
        </motion.button>
      ) : null}
    </>
  );
}
