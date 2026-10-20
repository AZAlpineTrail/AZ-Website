"use client";

import { Flame } from "lucide-react";
import type { FireAlertIncident } from "@/components/FireAlertBannerView";

/**
 * Thin Strip treatment: a slim, edge-to-edge red bar fixed directly under the
 * header nav row. Only rendered while a fire is active — brief name + distance,
 * with a "See details" link out. No dismiss control by design (kept simple).
 * Kept swappable — see FireAlertBanner.tsx.
 */
export function FireAlertThinStripView({ incidents }: { incidents: FireAlertIncident[] }) {
  if (incidents.length === 0) {
    return null;
  }

  const closest = incidents[0];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-[72px] z-40 sm:top-[88px] flex items-center justify-center gap-2.5 bg-[#e11f3f] px-4 py-2.5 text-center text-white shadow-[0_4px_18px_rgba(225,31,63,0.5)]"
    >
      <Flame size={17} aria-hidden="true" className="fire-alert-icon-flicker shrink-0" />
      <p className="min-w-0 truncate text-xs font-semibold sm:text-sm">
        <span className="font-mono font-black uppercase tracking-[0.1em]">Fire Advisory</span>
        <span className="opacity-70"> — </span>
        <span className="font-black">{closest.name ?? "Unconfirmed hotspot"}</span>
        <span className="opacity-90"> — {closest.distanceMiles} mi from the trail</span>
      </p>
      <a
        href="https://inciweb.wildfire.gov/"
        target="_blank"
        rel="noreferrer"
        className="shrink-0 font-mono text-[10px] font-black uppercase tracking-[0.1em] underline underline-offset-2 sm:text-[11px]"
      >
        See details
      </a>
    </div>
  );
}
