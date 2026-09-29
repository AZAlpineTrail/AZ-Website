"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail, Menu, Mountain, X } from "lucide-react";
import { AuthHeaderControls } from "@/components/auth/AuthHeaderControls";
import { openQuickContact } from "@/components/QuickContact";
// Fire advisory disabled for now — see note near <FireAlertBanner> below.
// import { FireAlertBanner } from "@/components/FireAlertBanner";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const prefersReducedMotion = useReducedMotion();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const isInitialMenuRender = useRef(true);
  const useSolidHeader = pathname !== "/" || scrolled || menuOpen;

  // Close the drawer on navigation. Adjusted during render (React's documented
  // pattern for state that depends on a changed prop) rather than in an effect,
  // so it doesn't cost an extra post-navigation render.
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }
  const on3DPage = pathname?.startsWith("/trail/3d");
  const navItems = [
    {
      label: "Trail",
      href: "/trail",
      current: pathname === "/trail" || (pathname?.startsWith("/trail/") && !on3DPage),
    },
    {
      label: "Downloads",
      href: "/downloads",
      current: pathname === "/downloads",
    },
    {
      label: "FAQ",
      href: "/faq",
      current: pathname === "/faq",
    },
    {
      label: "Shop",
      href: "/shop",
      current: pathname === "/shop",
    },
  ];

  useEffect(() => {
    const updateHeaderState = () => {
      setScrolled(window.scrollY > 24);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateHeaderState);
    };
  }, []);

  useFocusTrap(menuPanelRef, menuOpen);

  useEffect(() => {
    if (isInitialMenuRender.current) {
      isInitialMenuRender.current = false;
      return;
    }

    if (menuOpen) {
      menuCloseRef.current?.focus();
    } else {
      menuTriggerRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition duration-300 ${
        useSolidHeader
          ? "border-b border-white/12 bg-[#07150f]/88 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl"
          : "border-b border-white/0 bg-[#07150f]/8 shadow-none backdrop-blur-sm"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-[#13221a]"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex min-h-15 max-w-[1320px] items-center justify-between gap-2 px-3 sm:gap-6 sm:px-8">
        <Link href="/" className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <span className={`grid size-11 place-items-center rounded-full p-1 transition duration-300 ${
            useSolidHeader ? "bg-white/88 shadow-[0_8px_22px_rgba(0,0,0,0.16)]" : "bg-white/70 shadow-none"
          }`} aria-hidden="true">
            <Image
              src="/azat/brand/azat-logo.png"
              alt=""
              width={553}
              height={618}
              className="h-full w-auto object-contain"
              priority
            />
          </span>
          <span className="font-mono text-xs font-black uppercase leading-[1.05] tracking-[0.12em]">
            Arizona
            <span className="block">Alpine Trail</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex lg:gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                item.current ? "text-white" : "text-white/78"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/trail/3d"
            aria-current={on3DPage ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[11px] font-black uppercase tracking-[0.12em] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              on3DPage
                ? "border-[#f1b65a] bg-[#13221a] text-[#f1b65a] shadow-[0_6px_18px_rgba(241,182,90,0.22)]"
                : "border-[#f1b65a]/70 bg-gradient-to-b from-[#f6c877] to-[#e5a94f] text-[#13221a] shadow-[0_6px_18px_rgba(241,182,90,0.45)] hover:-translate-y-0.5 hover:from-[#f8d38c] hover:to-[#eab558] hover:shadow-[0_10px_26px_rgba(241,182,90,0.6)]"
            }`}
          >
            <Mountain size={14} aria-hidden="true" />
            3D Map
          </Link>
          <AuthHeaderControls />
        </div>

        <button
          ref={menuTriggerRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>
    </header>

    <AnimatePresence>
      {menuOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-[#07150f]/62 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            ref={menuPanelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-y-0 right-0 z-[75] flex w-full max-w-sm flex-col overflow-y-auto bg-[#fffdf7] pb-[env(safe-area-inset-bottom)] shadow-[-16px_0_40px_rgba(8,19,13,0.28)] lg:hidden"
            initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            animate={{ x: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex min-h-15 items-center justify-end px-3">
              <button
                ref={menuCloseRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[#13221a] transition hover:bg-[#f2efe4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Primary" className="flex flex-col gap-1 px-3 pb-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`flex min-h-14 items-center rounded-md px-3 text-lg font-semibold transition hover:bg-[#f2efe4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32] ${
                    item.current ? "text-[#b74f32]" : "text-[#13221a]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/trail/3d"
                aria-current={on3DPage ? "page" : undefined}
                className={`mt-2 flex min-h-14 items-center justify-center gap-2 rounded-full border px-4 font-mono text-xs font-black uppercase tracking-[0.12em] transition ${
                  on3DPage
                    ? "border-[#f1b65a] bg-[#13221a] text-[#f1b65a]"
                    : "border-[#f1b65a]/70 bg-gradient-to-b from-[#f6c877] to-[#e5a94f] text-[#13221a]"
                }`}
              >
                <Mountain size={14} aria-hidden="true" />
                3D Map
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.setTimeout(openQuickContact, 280);
                }}
                className="mt-3 flex min-h-14 items-center justify-center gap-2 rounded-sm bg-[#173d2b] px-4 font-bold text-white transition hover:bg-[#24563e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
              >
                <Mail size={18} aria-hidden="true" />
                Send us a message
              </button>
            </nav>
            <div className="mt-auto border-t border-[#d8ded4] px-3 py-4">
              <AuthHeaderControls variant="drawer" onNavigate={() => setMenuOpen(false)} />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>

    {/* Fire advisory disabled for now (WFIGS "active" heuristic produces too many false positives,
        FIRMS satellite feed still lacks FIRMS_MAP_KEY). Re-enable by restoring this line —
        the API route, cron, and data pipeline are untouched. */}
    {/* <FireAlertBanner variant="thinStrip" /> */}
    </>
  );
}
