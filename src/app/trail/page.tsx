import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrailHubExperience } from "@/components/TrailHubExperience";
import { getTrailHubSegments } from "@/lib/trail-segments";

export const metadata: Metadata = {
  title: "The Trail",
  description: "28 unique segments across the 704.5-mile Arizona Alpine Trail loop, with Porter Mountain and Little Colorado River each used twice.",
  alternates: { canonical: "/trail" },
  openGraph: {
    title: "Arizona Alpine Trail Map and Segments",
    description:
      "Explore 28 mapped trail segments across the Arizona Alpine Trail loop and download official route files.",
    url: "/trail",
  },
};

export default async function TrailPage() {
  const segments = await getTrailHubSegments();

  return (
    <>
      <Header />
      <TrailHubExperience segments={segments} />
      <Footer />
    </>
  );
}
