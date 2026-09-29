import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
};

const links = [
  { href: "/trail", label: "Trail segments" },
  { href: "/downloads", label: "GPX downloads" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <PageShell title="Page not found" description="That page moved or no longer exists.">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#b74f32] px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#9f432b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
        >
          Back to home
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-12 items-center rounded-full border border-[#d8ded4] px-5 text-sm font-bold text-[#13221a] transition hover:border-[#b74f32] hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
