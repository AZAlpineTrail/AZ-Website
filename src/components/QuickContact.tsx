"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { ContactForm } from "@/components/ContactForm";

const QUICK_CONTACT_EVENT = "azat:quick-contact";

export function openQuickContact() {
  window.dispatchEvent(new Event(QUICK_CONTACT_EVENT));
}

function isExcludedPath(pathname: string) {
  return (
    pathname === "/contact" ||
    pathname === "/account" ||
    pathname === "/login" ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/downloads/")
  );
}

export function QuickContact() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(QUICK_CONTACT_EVENT, handleOpen);
    return () => window.removeEventListener(QUICK_CONTACT_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("input:not([type='hidden'])")?.focus();
    }, 0);

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]):not([type='hidden']), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  if (isExcludedPath(pathname)) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send Arizona Alpine Trail a message"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[60] grid size-14 place-items-center rounded-full border border-white/25 bg-[#173d2b] text-white shadow-[0_10px_28px_rgba(7,21,15,0.34)] transition hover:-translate-y-0.5 hover:bg-[#24563e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b74f32] sm:bottom-6 sm:right-6"
      >
        <MessageCircle size={23} aria-hidden="true" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-sm bg-[#13221a] px-3 py-2 text-sm font-semibold shadow-lg group-hover:block group-focus-visible:block sm:block sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
          Send us a message
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[85] flex items-end justify-center overflow-y-auto overscroll-contain bg-[#07150f]/64 pt-6 backdrop-blur-sm sm:items-center sm:p-5"
            role="presentation"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              className="relative max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-t-md bg-[#fffdf7] px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 text-[#13221a] shadow-[0_-12px_44px_rgba(7,21,15,0.3)] sm:max-h-[calc(100dvh-2.5rem)] sm:max-w-2xl sm:rounded-md sm:p-7"
              initial={prefersReducedMotion ? false : { y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { y: 18, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close contact form"
                className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-[#13221a] transition hover:bg-[#f2efe4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <div className="pr-12">
                <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#b74f32]">Contact AZAT</p>
                <h2 id={titleId} className="mt-2 font-serif text-3xl font-semibold leading-tight">
                  Send us a message
                </h2>
                <p id={descriptionId} className="mt-2 max-w-xl text-sm leading-6 text-[#5f6c63]">
                  Share a question or comment and the Arizona Alpine Trail team will follow up by email.
                </p>
              </div>
              <div className="mt-5">
                <ContactForm compact />
              </div>
              <p className="mt-5 text-sm text-[#5f6c63]">
                Need more information?{" "}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="font-semibold text-[#173d2b] underline decoration-2 underline-offset-4 hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
                >
                  Visit the full contact page
                </Link>
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
