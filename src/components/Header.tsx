"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Map as MapIcon, Menu, Mountain, X } from "lucide-react";
import { AuthHeaderControls } from "@/components/auth/AuthHeaderControls";
// Fire advisory disabled for now — see note near <FireAlertBanner> below.
// import { FireAlertBanner } from "@/components/FireAlertBanner";

export function Header({ homeOverlay = false }: { homeOverlay?: boolean }) {
  const pathname = usePathname();
  const on3DPage = pathname?.startsWith("/trail/3d");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const prefersReducedMotion = useReducedMotion();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const isInitialMenuRender = useRef(true);
  const useFloatingMenu = on3DPage || scrolled || menuOpen;

  // Close the drawer on navigation. Adjusted during render (React's documented
  // pattern for state that depends on a changed prop) rather than in an effect,
  // so it doesn't cost an extra post-navigation render.
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }
  const showLogo = !on3DPage;
  const mapSwitch = on3DPage
    ? { href: "/#trail-map", label: "2D Map", Icon: MapIcon }
    : { href: "/trail/3d", label: "3D Map", Icon: Mountain };
  const navItems = [
    ...(on3DPage
      ? [
          {
            label: "Home",
            href: "/",
            current: false,
          },
        ]
      : []),
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
      setScrolled(window.scrollY > 72);
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
      className={`pointer-events-none absolute inset-x-0 top-0 z-50 text-white ${
        showLogo ? "h-[152px] sm:h-[184px]" : "h-24"
      } ${
        homeOverlay
          ? "bg-gradient-to-b from-[#07150f]/52 via-[#07150f]/12 to-transparent"
          : "bg-gradient-to-b from-[#07150f]/72 via-[#07150f]/42 to-transparent"
      }`}
    >
      <a
        href="#main"
        className="pointer-events-auto sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-[#13221a]"
      >
        Skip to main content
      </a>
      <div className="relative mx-auto h-full max-w-[1320px] px-3 sm:px-8">
        {showLogo ? (
          <Link
            href="/"
            aria-label="Arizona Alpine Trail home"
            className="pointer-events-auto absolute left-3 top-3 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:left-5 sm:top-4 lg:left-8 lg:top-6"
          >
            <Image
              src="/azat/brand/azat-logo.png"
              alt=""
              width={553}
              height={618}
              sizes="(max-width: 639px) 140px, (max-width: 1023px) 162px, 198px"
              className="h-[156px] w-auto object-contain drop-shadow-[0_8px_22px_rgba(0,0,0,0.42)] sm:h-[180px] lg:h-[220px]"
              priority
            />
          </Link>
        ) : null}

        <motion.div
          aria-hidden={scrolled || on3DPage}
          className={`absolute right-5 top-10 origin-right items-center gap-2 px-0 py-1.5 xl:right-8 ${
            on3DPage ? "hidden" : "hidden lg:flex"
          }`}
          initial={false}
          animate={
            scrolled || on3DPage
              ? prefersReducedMotion
                ? { opacity: 0, pointerEvents: "none" }
                : { opacity: 0, scaleX: 0.18, x: 20, filter: "blur(6px)", pointerEvents: "none" }
              : { opacity: 1, scaleX: 1, x: 0, filter: "blur(0px)", pointerEvents: "auto" }
          }
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
            <nav aria-label="Primary" className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    item.current ? "bg-white/12 text-white" : "text-white/82"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
              <Link
                href={mapSwitch.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#f1b65a]/70 bg-gradient-to-b from-[#f6c877] to-[#e5a94f] px-4 py-2 font-mono text-[11px] font-black uppercase tracking-[0.12em] text-[#13221a] shadow-[0_6px_18px_rgba(241,182,90,0.32)] transition duration-200 hover:-translate-y-0.5 hover:from-[#f8d38c] hover:to-[#eab558] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <mapSwitch.Icon size={14} aria-hidden="true" />
                {mapSwitch.label}
              </Link>
              <AuthHeaderControls />
        </motion.div>

        <button
          ref={menuTriggerRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={`pointer-events-auto fixed z-[1] inline-flex min-h-14 items-center border border-white/16 bg-[#07150f]/74 px-5 font-mono text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl backdrop-saturate-150 transition-[top,right,background-color,box-shadow,border-radius] duration-300 hover:border-white/30 hover:bg-[#102a1e]/82 hover:shadow-[0_14px_36px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            menuOpen ? "invisible" : ""
          } ${
            useFloatingMenu ? "lg:right-8 lg:inline-flex" : "lg:top-10 lg:hidden"
          } right-3 top-3 rounded-full sm:right-5 sm:top-5 ${scrolled && !on3DPage ? "az-menu-collapsed" : ""}`}
        >
          <span
            className="mr-2.5 inline-flex text-[#f1b65a]"
          >
            <Menu size={22} aria-hidden="true" />
          </span>
          Menu
        </button>
      </div>
    </header>

    {!homeOverlay ? (
      <div aria-hidden="true" className={`az-fall-heading ${showLogo ? "h-[152px] sm:h-[184px]" : "h-24"}`} />
    ) : null}

    <AnimatePresence>
      {menuOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-[#07150f]/62 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            ref={menuPanelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="az-liquid-menu fixed inset-y-0 right-0 z-[75] flex w-full max-w-sm flex-col overflow-y-auto border-l border-white/10 pb-[env(safe-area-inset-bottom)] text-white"
            initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            animate={{ x: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex min-h-[64px] items-center justify-end border-b border-white/10 px-3">
              <button
                ref={menuCloseRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/14 bg-[#07150f]/38 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/28 hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Primary" className="flex flex-col gap-1 px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={`flex min-h-12 items-center rounded-md px-3 text-lg font-semibold transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      item.current ? "bg-white/12 text-white" : "text-white/82"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              <div className="mt-3 border-t border-white/16 pt-4">
                <Link
                  href={mapSwitch.href}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-[#f1b65a]/70 bg-gradient-to-b from-[#f6c877] to-[#e5a94f] px-5 font-mono text-xs font-black uppercase tracking-[0.12em] text-[#13221a] shadow-[0_8px_22px_rgba(241,182,90,0.24)] transition hover:-translate-y-0.5 hover:from-[#f8d38c] hover:to-[#eab558] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <mapSwitch.Icon size={14} aria-hidden="true" />
                  {mapSwitch.label}
                </Link>
                <div className="mt-2">
                  <AuthHeaderControls variant="drawer" onNavigate={() => setMenuOpen(false)} />
                </div>
              </div>
            </nav>
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
