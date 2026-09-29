"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useFocusTrap } from "@/lib/useFocusTrap";

type AuthMode = "sign-in" | "sign-up";

type AuthModalEventDetail = {
  mode?: AuthMode;
  next?: string;
};

function isAuthMode(mode: string | null): mode is AuthMode {
  return mode === "sign-in" || mode === "sign-up";
}

function safeNextPath(next: string | null | undefined, fallback: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  return next;
}

export function openAuthModal(mode: AuthMode, next?: string) {
  window.dispatchEvent(
    new CustomEvent<AuthModalEventDetail>("azat:auth-modal", {
      detail: { mode, next },
    }),
  );
}

export function AuthModalProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const fallbackNext = pathname || "/account";
  const queryMode = searchParams.get("auth");
  const queryNext = searchParams.get("next");
  const queryIsOpen = isAuthMode(queryMode);
  const [manualState, setManualState] = useState<{
    mode: AuthMode;
    nextPath: string;
    open: boolean;
  }>({ mode: "sign-in", nextPath: "/account", open: false });
  const mode = queryIsOpen ? queryMode : manualState.mode;
  const nextPath = queryIsOpen
    ? safeNextPath(queryNext, fallbackNext)
    : manualState.nextPath;
  const open = queryIsOpen || manualState.open;
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open, { autoFocus: true, restoreFocus: true });

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<AuthModalEventDetail>).detail;
      const next = safeNextPath(detail?.next, "/account");

      setManualState({
        mode: detail?.mode ?? "sign-in",
        nextPath: next,
        open: true,
      });
    };

    window.addEventListener("azat:auth-modal", handleOpen);
    return () => window.removeEventListener("azat:auth-modal", handleOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setManualState((current) => ({ ...current, open: false }));

        if (queryIsOpen) {
          const nextParams = new URLSearchParams(searchParams.toString());
          nextParams.delete("auth");
          nextParams.delete("next");
          const nextQuery = nextParams.toString();
          router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
            scroll: false,
          });
        }
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
  }, [open, pathname, queryIsOpen, router, searchParams]);

  function closeModal() {
    setManualState((current) => ({ ...current, open: false }));

    if (queryIsOpen) {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("auth");
      nextParams.delete("next");
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    }
  }

  function switchMode(nextMode: AuthMode) {
    if (queryIsOpen) {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("auth", nextMode);
      nextParams.set("next", nextPath);
      router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
      return;
    }

    setManualState((current) => ({
      ...current,
      mode: nextMode,
    }));
  }

  const title = mode === "sign-up" ? "Create your trail account" : "Log in to continue";
  const modalLabel = `${title} dialog`;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] grid items-start justify-items-center overflow-y-auto overscroll-contain bg-[#07150f]/62 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 backdrop-blur-sm sm:place-items-center"
          role="dialog"
          aria-modal="true"
          aria-label={modalLabel}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <motion.div
            ref={panelRef}
            className="relative w-full max-w-2xl"
            initial={prefersReducedMotion ? false : { y: 18, scale: 0.975, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: 10, scale: 0.985, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={closeModal}
              className="absolute -right-2 -top-2 z-10 grid size-11 place-items-center rounded-full border border-[#d8ded4] bg-[#fffdf7] text-[#13221a] shadow-[0_10px_26px_rgba(19,34,26,0.16)] transition hover:border-[#b74f32] hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <AuthForm
              mode={mode}
              nextPath={nextPath}
              onModeChange={switchMode}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
