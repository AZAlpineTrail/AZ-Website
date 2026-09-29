import Link from "next/link";
import { ExternalLink, Mail, UsersRound } from "lucide-react";

const footerLinks = [
  { label: "Trail", href: "/trail" },
  { label: "Map", href: "/#trail-map" },
  { label: "Downloads", href: "/downloads" },
  { label: "Resources", href: "/resources" },
  { label: "Itineraries", href: "/#itineraries" },
  { label: "FAQ", href: "/faq" },
  { label: "Shop", href: "/shop" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/azalpinetrail" },
  {
    label: "Facebook group",
    href: "https://www.facebook.com/groups/1324603116216826/",
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[#08130d] text-white">
      <div className="mx-auto grid max-w-[1220px] gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(220px,360px)_minmax(220px,300px)] lg:items-start lg:gap-12">
        <div className="min-w-0">
          <p className="max-w-[18rem] text-wrap font-serif text-3xl font-semibold leading-none sm:max-w-none sm:text-4xl">
            Arizona Alpine Trail
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/58">
            Arizona Alpine Trail, Inc. is a 501(c)(3) nonprofit supporting responsible OHV travel and trail stewardship.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#e5b96f]">Explore</p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-10 items-center text-white/72 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#e5b96f]">Connect</p>
          <div className="mt-4 grid gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-[#e5b96f]/60 bg-[#e5b96f] px-4 font-bold text-[#13221a] transition hover:border-[#f1c77f] hover:bg-[#f1c77f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Mail size={16} aria-hidden="true" />
              Contact AZAT
            </Link>
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 text-white/72 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {item.label === "Facebook group" ? (
                  <UsersRound size={16} aria-hidden="true" />
                ) : (
                  <ExternalLink size={16} aria-hidden="true" />
                )}
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-sm text-white/52">
        Arizona Alpine Trail, Inc. 501(c)(3).
      </div>
    </footer>
  );
}
