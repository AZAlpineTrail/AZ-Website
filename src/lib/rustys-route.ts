import { sanityClient } from "@/sanity/lib/client";
import { rustysRoutePageQuery } from "@/sanity/lib/queries";
import type { HomeCta, HomeDownload, HomeTrailHighlight } from "@/lib/home";

export type RustysRouteDay = {
  day: string;
  route: string;
  via?: string;
  miles: string;
  fuel: string;
  lodging: string;
};

export type RustysRoutePlanningNote = {
  label: string;
  text: string;
};

export type RustysRoutePageData = {
  title?: string;
  heroKicker?: string;
  heroTitle: string;
  heroCopy?: string;
  heroImage?: string;
  heroImageAlt?: string;
  facts?: HomeDownload[];
  downloadCta?: HomeCta;
  overviewKicker?: string;
  overviewTitle?: string;
  overviewCopy?: string;
  mapHighlights?: HomeTrailHighlight[];
  planningKicker?: string;
  planningNotes?: RustysRoutePlanningNote[];
  itineraryKicker?: string;
  itineraryTitle?: string;
  lodgingNote?: string;
  itineraryDays?: RustysRouteDay[];
  finalCtaKicker?: string;
  finalCtaTitle?: string;
  finalCtaImage?: string;
  finalCtaImageAlt?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export const fallbackRustysRoutePage: RustysRoutePageData = {
  title: "Rusty 1000",
  heroKicker: "Rusty 1000",
  heroTitle: "Eleven days around the high country.",
  heroCopy: "A hotel-based Arizona Alpine Trail itinerary beginning and ending in Alpine.",
  heroImage: "/azat/photos/735761389_1318522053829180_4711200860303823554_n.jpg",
  heroImageAlt: "Arizona Alpine Trail high country scenery",
  facts: [
    { label: "11 days", value: "Hotel itinerary" },
    { label: "~1,000 mi", value: "With town connectors" },
    { label: "Start anywhere", value: "Clockwise or counterclockwise" },
  ],
  downloadCta: { label: "Download GPX", href: "/downloads/arizona-alpine-trail-gpx" },
  overviewKicker: "Route overview",
  overviewTitle: "The loop at a glance.",
  overviewCopy: "Town markers show the overnight rhythm; the line shows the AZAT backbone.",
  mapHighlights: [
    { _key: "alpine", title: "Alpine", category: "Start / finish", icon: "map-pin", coordinates: { lat: 33.8481, lng: -109.1436 } },
    { _key: "greer", title: "Greer", category: "Lodging stop", icon: "lodging", coordinates: { lat: 34.0115, lng: -109.4587 } },
    { _key: "show-low", title: "Show Low", category: "Fuel and lodging", icon: "fuel", coordinates: { lat: 34.2499, lng: -110.0438 } },
    { _key: "heber-overgaard", title: "Heber-Overgaard", category: "Hub town", icon: "map-pin", coordinates: { lat: 34.4141, lng: -110.5687 } },
    { _key: "pine", title: "Pine", category: "Lodging stop", icon: "lodging", coordinates: { lat: 34.407, lng: -111.4926 } },
    { _key: "punkin-center", title: "Punkin Center", category: "Limited lodging", icon: "lodging", coordinates: { lat: 33.8684, lng: -111.3001 } },
    { _key: "young", title: "Young", category: "Limited lodging", icon: "lodging", coordinates: { lat: 34.1017, lng: -110.9637 } },
    { _key: "hannagan-meadow", title: "Hannagan Meadow", category: "Limited lodging", icon: "lodging", coordinates: { lat: 33.6426, lng: -109.3223 } },
  ],
  planningKicker: "Know before you go",
  planningNotes: [
    {
      label: "Flexible route",
      text: "Start in Alpine, Show Low, Payson, Heber-Overgaard, or another town along the trail.",
    },
    {
      label: "Best hubs",
      text: "Alpine, Show Low, Payson, and Heber-Overgaard have the strongest mix of fuel, food, lodging, and supplies.",
    },
    {
      label: "Limited lodging",
      text: "Young, Heber, Punkin Center, and Hannagan Meadow have limited motel options. Book early.",
    },
    {
      label: "Mileage note",
      text: "The core AZAT is about 700 miles. Rusty 1000 adds town connectors, fuel stops, sightseeing, and side roads.",
    },
  ],
  itineraryKicker: "Itinerary",
  itineraryTitle: "Day by day.",
  lodgingNote: "Book lodging early. Young, Heber, Punkin Center, and Hannagan Meadow are limited.",
  itineraryDays: [
    { day: "01", route: "Alpine to Greer", via: "FR 1122", miles: "~100", fuel: "Eagar", lodging: "Lazy Trout Lodge" },
    { day: "02", route: "Greer to Show Low", miles: "~85", fuel: "Show Low", lodging: "Days Inn" },
    { day: "03", route: "Show Low to Heber-Overgaard", via: "FR 504", miles: "~100", fuel: "Show Low, Heber", lodging: "Sawmill Inn" },
    { day: "04", route: "Heber-Overgaard to Pine", miles: "~110", fuel: "Pine", lodging: "The Strawberry Inn" },
    { day: "05", route: "Pine to Punkin Center", miles: "~80", fuel: "Tonto Basin", lodging: "Punkin Center Lodge" },
    { day: "06", route: "Punkin Center to Young", via: "FR 288", miles: "~90", fuel: "Young", lodging: "Pleasant Valley Inn" },
    { day: "07", route: "Young to Heber-Overgaard", via: "Black Canyon Rd", miles: "~90", fuel: "Heber", lodging: "Sawmill Inn" },
    { day: "08", route: "Heber-Overgaard to Show Low", miles: "~90", fuel: "Show Low", lodging: "Days Inn" },
    { day: "09", route: "Show Low to Greer", via: "FR 1122", miles: "~85", fuel: "Big Lake or Eagar", lodging: "Lazy Trout Lodge" },
    { day: "10", route: "Greer to Hannagan Meadow", via: "FR 576", miles: "~85", fuel: "Big Lake", lodging: "Hannagan Lodge" },
    { day: "11", route: "Hannagan Meadow to Alpine", miles: "~85", fuel: "Alpine", lodging: "Trip ends" },
  ],
  finalCtaKicker: "Ready to ride",
  finalCtaTitle: "Take the route file with you.",
  finalCtaImage: "/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg",
  finalCtaImageAlt: "",
  seo: {
    title: "Rusty 1000",
    description: "An 11-day hotel-based ride around the Arizona Alpine Trail.",
  },
};

function mergeRustysRoutePage(data: RustysRoutePageData | null): RustysRoutePageData {
  if (!data?.heroTitle) return fallbackRustysRoutePage;

  return {
    ...fallbackRustysRoutePage,
    ...data,
    heroImage: data.heroImage || fallbackRustysRoutePage.heroImage,
    heroImageAlt: data.heroImageAlt || fallbackRustysRoutePage.heroImageAlt,
    facts: data.facts?.length ? data.facts : fallbackRustysRoutePage.facts,
    downloadCta: data.downloadCta?.href ? data.downloadCta : fallbackRustysRoutePage.downloadCta,
    mapHighlights: data.mapHighlights?.length ? data.mapHighlights : fallbackRustysRoutePage.mapHighlights,
    planningNotes: data.planningNotes?.length ? data.planningNotes : fallbackRustysRoutePage.planningNotes,
    itineraryDays: data.itineraryDays?.length ? data.itineraryDays : fallbackRustysRoutePage.itineraryDays,
    finalCtaImage: data.finalCtaImage || fallbackRustysRoutePage.finalCtaImage,
    finalCtaImageAlt: data.finalCtaImageAlt || fallbackRustysRoutePage.finalCtaImageAlt,
  };
}

export async function getRustysRoutePageData(): Promise<RustysRoutePageData> {
  try {
    const data = await sanityClient.fetch<RustysRoutePageData | null>(
      rustysRoutePageQuery,
      {},
      process.env.NODE_ENV === "development" ? { cache: "no-store" } : { next: { revalidate: 30 } },
    );

    return mergeRustysRoutePage(data);
  } catch {
    return fallbackRustysRoutePage;
  }
}
