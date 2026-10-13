import path from "node:path";

import { sanityClient } from "@/sanity/lib/client";
import { trailSegmentListQuery, trailSegmentQuery } from "@/sanity/lib/queries";
import { routeSegmentSummaries } from "@/lib/route-preview-data";
import { trailSegmentIndex } from "@/lib/trail-segment-index";
import { loadAllSegmentPageData } from "@/lib/segment-content.mjs";

export { trailSegmentIndex };

export type TrailHubSegment = {
  number: number;
  name: string;
  gpxId: string;
  slug: string;
  distanceMiles: number | null;
  minElevationFeet: number | null;
  maxElevationFeet: number | null;
  trailRating: string | null;
  published: boolean;
};

export type TrailSegmentDownload = {
  title?: string;
  slug?: { current?: string };
  fileType?: string;
  version?: string;
  publishedAt?: string;
  externalUrl?: string;
  notes?: string;
};

export type TrailSegmentGalleryImage = {
  url?: string;
  alt?: string;
};

export type TrailSegmentPageData = {
  title: string;
  slug?: { current: string };
  segmentCode?: string;
  segmentNumber: number;
  status?: string;
  lengthMiles?: number;
  minElevationFeet?: number;
  maxElevationFeet?: number;
  elevationGainFeet?: number;
  elevationLossFeet?: number;
  trailRating?: string;
  startTown?: { title?: string; slug?: { current?: string } };
  endTown?: { title?: string; slug?: { current?: string } };
  downloads?: TrailSegmentDownload[];
  heroImage?: string;
  heroImageAlt?: string;
  mapImage?: string;
  mapImageAlt?: string;
  descriptionBody?: unknown;
  amenities?: string[];
  amenitiesNote?: string;
  safetyNote?: string;
  pointsOfInterest?: string[];
  gallery?: TrailSegmentGalleryImage[];
  lastVerifiedAt?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

// Every segment with a public/azat/segments/<slug>/content.json file gets a fallback page —
// that file is the publish switch. See public/azat/segments/README.md for the drop-in-a-folder
// workflow this replaces hand-written per-segment fallback objects with. Read fresh on every
// call (not cached at module load) so a newly dropped segment folder shows up without
// restarting the dev server — the whole point of the template is a same-second feedback loop.
function getFallbacksBySlug(): Record<string, TrailSegmentPageData> {
  return loadAllSegmentPageData(trailSegmentIndex, {
    publicDir: path.resolve(process.cwd(), "public"),
  }) as Record<string, TrailSegmentPageData>;
}

// These descriptions contain endpoint wording verified against the current master
// spreadsheet. Keep the rest of each Sanity-authored page intact.
const spreadsheetAlignedDescriptionSlugs = new Set(["hannagan", "johns-canyon", "south-fork"]);

export function getPublishedSlugs(): string[] {
  return Object.keys(getFallbacksBySlug());
}

export async function getTrailHubSegments(): Promise<TrailHubSegment[]> {
  const fallbacksBySlug = getFallbacksBySlug();

  // A slug counts as published if it has a real Sanity document OR a code-level fallback
  // (see `getPublishedSlugs` above) — the segment detail page renders from the fallback either
  // way, so the hub must agree, or it would hide a page that actually works.
  const knownPublished = new Set(Object.keys(fallbacksBySlug));

  // Seed ratings from the code-level fallbacks so the filter works even before a matching
  // Sanity document exists; a real Sanity value overrides it below.
  const ratingsBySlug = new Map<string, string>();
  Object.values(fallbacksBySlug).forEach((data) => {
    if (data.slug?.current && data.trailRating) ratingsBySlug.set(data.slug.current, data.trailRating);
  });

  try {
    const docs = await sanityClient.fetch<{ slug?: { current?: string }; trailRating?: string }[]>(
      trailSegmentListQuery,
      {},
      process.env.NODE_ENV === "development" ? { cache: "no-store" } : { next: { revalidate: 30 } },
    );
    docs.forEach((doc) => {
      if (doc.slug?.current) {
        knownPublished.add(doc.slug.current);
        if (doc.trailRating) ratingsBySlug.set(doc.slug.current, doc.trailRating);
      }
    });
  } catch {
    // Sanity unreachable — the code-level fallbacks above still stand.
  }

  return trailSegmentIndex.map((entry) => {
    const summary = routeSegmentSummaries.find((item) => item.id === entry.gpxId);
    const official = fallbacksBySlug[entry.slug];
    return {
      number: entry.number,
      name: entry.name,
      gpxId: entry.gpxId,
      slug: entry.slug,
      distanceMiles: official?.lengthMiles ?? summary?.distanceMiles ?? null,
      minElevationFeet: official?.minElevationFeet ?? summary?.minElevationFeet ?? null,
      maxElevationFeet: official?.maxElevationFeet ?? summary?.maxElevationFeet ?? null,
      trailRating: official?.trailRating ?? ratingsBySlug.get(entry.slug) ?? null,
      published: knownPublished.has(entry.slug),
    };
  });
}

function mergeTrailSegmentPage(data: TrailSegmentPageData | null, fallback: TrailSegmentPageData): TrailSegmentPageData {
  if (!data?.title) return fallback;

  return {
    ...fallback,
    ...data,
    downloads: data.downloads?.length ? data.downloads : fallback.downloads,
    heroImage: data.heroImage || fallback.heroImage,
    heroImageAlt: data.heroImageAlt || fallback.heroImageAlt,
    mapImage: data.mapImage || fallback.mapImage,
    mapImageAlt: data.mapImageAlt || fallback.mapImageAlt,
    amenities: data.amenities?.length ? data.amenities : fallback.amenities,
    pointsOfInterest: data.pointsOfInterest?.length ? data.pointsOfInterest : fallback.pointsOfInterest,
    gallery: data.gallery?.length ? data.gallery : fallback.gallery,
    // Spreadsheet-backed route facts in the checked-in fallback remain authoritative even
    // if an older Sanity document still contains stale mileage, elevation, or difficulty.
    segmentCode: fallback.segmentCode,
    segmentNumber: fallback.segmentNumber,
    lengthMiles: fallback.lengthMiles,
    minElevationFeet: fallback.minElevationFeet,
    maxElevationFeet: fallback.maxElevationFeet,
    elevationGainFeet: fallback.elevationGainFeet,
    elevationLossFeet: fallback.elevationLossFeet,
    trailRating: fallback.trailRating,
    descriptionBody: spreadsheetAlignedDescriptionSlugs.has(fallback.slug?.current ?? "")
      ? fallback.descriptionBody
      : data.descriptionBody || fallback.descriptionBody,
    seo: fallback.seo,
  };
}

export type TrailSegmentNeighbor = { name: string; slug: string; published: boolean } | null;

export function getTrailSegmentNeighbors(segmentNumber: number): { prev: TrailSegmentNeighbor; next: TrailSegmentNeighbor } {
  const publishedSlugs = getPublishedSlugs();
  const sorted = [...trailSegmentIndex].sort((a, b) => a.number - b.number);
  const index = sorted.findIndex((entry) => entry.number === segmentNumber);
  const toNeighbor = (entry: (typeof trailSegmentIndex)[number] | undefined): TrailSegmentNeighbor =>
    entry ? { name: entry.name, slug: entry.slug, published: publishedSlugs.includes(entry.slug) } : null;

  return {
    prev: index > 0 ? toNeighbor(sorted[index - 1]) : null,
    next: index >= 0 && index < sorted.length - 1 ? toNeighbor(sorted[index + 1]) : null,
  };
}

export async function getTrailSegmentPageData(slug: string): Promise<TrailSegmentPageData | null> {
  const fallback = getFallbacksBySlug()[slug];

  try {
    const data = await sanityClient.fetch<TrailSegmentPageData | null>(
      trailSegmentQuery,
      { slug },
      process.env.NODE_ENV === "development" ? { cache: "no-store" } : { next: { revalidate: 30 } },
    );

    if (data) return fallback ? mergeTrailSegmentPage(data, fallback) : data;
    return fallback ?? null;
  } catch {
    return fallback ?? null;
  }
}
