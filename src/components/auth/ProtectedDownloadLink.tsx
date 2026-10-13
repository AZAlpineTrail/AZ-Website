"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { openAuthModal } from "@/components/auth/AuthModal";
import { createSupabaseBrowserClient } from "@/supabase/client";

type ProtectedDownloadLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  fileType?: string;
};

function downloadEventProperties(href: string, fileType?: string) {
  const pathname = href.split(/[?#]/, 1)[0];
  if (pathname === "/downloads/bulk") {
    return { file: "selected-files", type: "ZIP" };
  }
  const slug = pathname.match(/^\/downloads\/([^/]+)$/)?.[1];

  if (!slug) return null;

  const inferredType = slug.includes("shapefile")
    ? "SHP"
    : slug.endsWith("-kml")
      ? "KML"
      : "GPX";

  return {
    file: decodeURIComponent(slug),
    type: fileType ?? inferredType,
  };
}

function trackDownloadEvent(
  name: "download_cta_clicked" | "download_auth_required",
  properties: NonNullable<ReturnType<typeof downloadEventProperties>> & {
    reason?: "signed_out" | "auth_unavailable";
  },
) {
  try {
    track(name, properties);
  } catch (error) {
    console.error(`Vercel Analytics event failed: ${name}`, error);
  }
}

export function ProtectedDownloadLink({
  href,
  className,
  children,
  onClick,
  ariaLabel,
  fileType,
}: ProtectedDownloadLinkProps) {
  const router = useRouter();

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.();

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const properties = downloadEventProperties(href, fileType);
    if (properties) {
      trackDownloadEvent("download_cta_clicked", properties);
    }

    event.preventDefault();

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      if (properties) {
        trackDownloadEvent("download_auth_required", {
          ...properties,
          reason: "auth_unavailable",
        });
      }
      openAuthModal("sign-up", href);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (properties) {
        trackDownloadEvent("download_auth_required", {
          ...properties,
          reason: "signed_out",
        });
      }
      openAuthModal("sign-up", href);
      return;
    }

    router.push(href);
  }

  return (
    <Link href={href} className={className} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
