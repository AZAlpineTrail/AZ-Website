import type { Metadata } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthModalProvider } from "@/components/auth/AuthModal";
import { QuickContact } from "@/components/QuickContact";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://azalpinetrail.org"),
  title: {
    default: "Arizona Alpine Trail",
    template: "%s | Arizona Alpine Trail",
  },
  description:
    "Plan the Arizona Alpine Trail with official route maps, segment guides, GPX downloads, safety resources, and trail updates.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Arizona Alpine Trail",
    description:
      "Official route maps, segment guides, GPX downloads, safety resources, and trail updates for the Arizona Alpine Trail.",
    url: "https://azalpinetrail.org",
    siteName: "Arizona Alpine Trail",
    type: "website",
    images: [
      {
        url: "/azat/images/trail-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Arizona Alpine Trail high-country route landscape",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arizona Alpine Trail",
    description:
      "Official route maps, segment guides, GPX downloads, safety resources, and trail updates for the Arizona Alpine Trail.",
    images: ["/azat/images/trail-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        {children}
        <Suspense fallback={null}>
          <AuthModalProvider />
          <QuickContact />
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
