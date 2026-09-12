"use client";

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
};

export function ProtectedDownloadLink({
  href,
  className,
  children,
  onClick,
  ariaLabel,
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

    event.preventDefault();

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      openAuthModal("sign-up", href);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
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
