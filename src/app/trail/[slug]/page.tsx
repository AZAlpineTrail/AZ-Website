import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrailSegmentExperience } from "@/components/TrailSegmentExperience";
import { getTrailSegmentDisplayNumber } from "@/lib/trail-segment-index";
import { getPublishedSlugs, getTrailSegmentNeighbors, getTrailSegmentPageData } from "@/lib/trail-segments";

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTrailSegmentPageData(slug);
  if (!data) return {};

  return {
    title: `${data.title} — Arizona Alpine Trail Segment ${getTrailSegmentDisplayNumber(data.segmentNumber)}`,
    description: data.seo?.description,
  };
}

export default async function TrailSegmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getTrailSegmentPageData(slug);
  if (!data) notFound();

  const neighbors = getTrailSegmentNeighbors(data.segmentNumber);

  return (
    <>
      <Header />
      <TrailSegmentExperience data={data} prev={neighbors.prev} next={neighbors.next} />
      <Footer />
    </>
  );
}
