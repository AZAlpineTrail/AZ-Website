"use client";

import { useEffect, type RefObject } from "react";

const focusableSelector =
  "a[href], button:not([disabled]), input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * Keeps Tab / Shift+Tab inside `containerRef` while `active`, including when focus
 * starts outside it. Optionally moves focus in on open and restores it on close.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  { autoFocus = false, restoreFocus = false }: { autoFocus?: boolean; restoreFocus?: boolean } = {},
) {
  useEffect(() => {
    if (!active) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(containerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter(
        (element) => element.getClientRects().length > 0,
      );

    const focusTimer = autoFocus
      ? window.setTimeout(() => {
          const container = containerRef.current;
          if (!container || container.contains(document.activeElement)) return;
          const target =
            container.querySelector<HTMLElement>("input:not([type='hidden']):not([disabled])") ?? getFocusable()[0];
          target?.focus();
        }, 0)
      : undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !containerRef.current) return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      const inside = containerRef.current.contains(current);

      if (event.shiftKey && (!inside || current === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || current === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocus && previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [active, autoFocus, restoreFocus, containerRef]);
}
