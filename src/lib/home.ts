import { sanityClient } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/lib/queries";

export type HomeCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "text";
};

export type HomeDownload = {
  label: string;
  value?: string;
  description?: string;
  href?: string;
};

export type HomeMapLayer = {
  label: string;
  active?: boolean;
};

export type HomeCoordinates = {
  lat: number;
  lng: number;
};

export type HomeTrailHighlight = {
  _key?: string;
  title: string;
  category?: string;
  note?: string;
  image?: string;
  imageAlt?: string;
  coordinates?: HomeCoordinates;
  icon?: "mountain" | "map-pin" | "fuel" | "lodging" | "trees" | "route" | "scenic";
  facts?: HomeDownload[];
  town?: { title?: string; slug?: { current?: string } };
  route?: { title?: string; slug?: { current?: string } };
};

export type HomeItineraryCard = {
  _key?: string;
  title: string;
  label?: string;
  href?: string;
  image?: string;
  imageAlt?: string;
  miles?: string;
  days?: string;
  status?: "Available" | "Coming Soon" | "Draft" | string;
};

export type HomeTimelineStop = {
  day: string;
  title: string;
  miles?: string;
  fuel?: string;
  lodging?: string;
};

export type HomeStat = {
  label: string;
  value?: string;
  description?: string;
};

export type HomeIconCard = {
  icon?: "shield" | "map" | "fuel" | "tools" | "trees" | "store" | "download";
  title: string;
  text?: string;
};

export type HomeStoryBlock = {
  eyebrow?: string;
  title: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  cta?: HomeCta;
};

export type HomeRideChapter = {
  type?: "trailhead" | "landscape" | "map" | "download" | "towns" | "stewardship";
  eyebrow?: string;
  title: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  cta?: HomeCta;
};

export type HomePageData = {
  title?: string;
  heroTitle: string;
  heroCopy?: string;
  heroImage?: string;
  heroImageAlt?: string;
  primaryCta?: HomeCta;
  secondaryCta?: HomeCta;
  missionStatement?: string;
  missionAttribution?: string;
  missionImage?: string;
  missionImageAlt?: string;
  mapTitle?: string;
  mapCopy?: string;
  mapLayers?: HomeMapLayer[];
  trailHighlights?: HomeTrailHighlight[];
  downloads?: HomeDownload[];
  itineraryTitle?: string;
  itineraryImage?: string;
  itineraryImageAlt?: string;
  itineraryHref?: string;
  itineraryCards?: HomeItineraryCard[];
  routeImage?: string;
  routeImageAlt?: string;
  routeTitle?: string;
  routeCopy?: string;
  timeline?: HomeTimelineStop[];
  rideChapters?: HomeRideChapter[];
  storyBlocks?: HomeStoryBlock[];
  resourceLinks?: HomeIconCard[];
  communityTitle?: string;
  communityCopy?: string;
  communityImage?: string;
  communityImageAlt?: string;
  communityStats?: HomeStat[];
  safetyTitle?: string;
  safetyCards?: HomeIconCard[];
  featuredNewsTitle?: string;
  footerCtaTitle?: string;
  footerCtaCopy?: string;
};

export const fallbackHomePage: HomePageData = {
  title: "Arizona Alpine Trail",
  heroTitle: "Arizona Alpine Trail",
  heroCopy: "View the route. Download the GPX.",
  heroImage: "/azat/photos/735761389_1318522053829180_4711200860303823554_n.jpg",
  heroImageAlt: "Aerial view of a dirt trail winding through Arizona high-country juniper landscape",
  primaryCta: { label: "View 3D Map", href: "/trail/3d" },
  secondaryCta: { label: "Download GPX", href: "/downloads/arizona-alpine-trail-gpx", variant: "secondary" },
  missionStatement:
    "To develop, maintain, document, and promote an OHV trail system through Eastern Arizona while advancing rider safety, environmental respect, and public awareness.",
  missionAttribution: "Jerry Smith, President",
  missionImage: "/azat/ride/ride-forest.jpg",
  missionImageAlt: "Forest trail corridor on the Arizona Alpine Trail",
  mapTitle: "Interactive Trail Map",
  mapCopy: "",
  mapLayers: [
    { label: "Main Route", active: true },
    { label: "Towns", active: true },
    { label: "Fuel", active: true },
    { label: "Camping", active: false },
  ],
  trailHighlights: [
    {
      title: "Alpine trailhead",
      category: "Trailhead",
      note: "High-country access and the natural anchor for Rusty 1000.",
      icon: "map-pin",
      image: "/azat/photos/735958897_1320343090313743_536962654379825153_n.jpg",
      imageAlt: "Forest road and mountain country near the Arizona Alpine Trail",
      coordinates: { lat: 33.8481, lng: -109.1437 },
      facts: [
        { label: "Town", value: "Alpine" },
        { label: "Use", value: "Start / Finish" },
      ],
    },
    {
      title: "Greer mountain stop",
      category: "Lodging",
      note: "A scenic overnight rhythm point with lodging and food close to the route.",
      icon: "lodging",
      image: "/azat/photos/732464064_1316837460664306_6804428316960632023_n.jpg",
      imageAlt: "Arizona high country trees and open trail landscape",
      coordinates: { lat: 34.0106, lng: -109.4584 },
      facts: [
        { label: "Town", value: "Greer" },
        { label: "Plan", value: "Book early" },
      ],
    },
    {
      title: "Show Low services",
      category: "Fuel",
      note: "A larger services hub for fuel, groceries, repairs, and route decisions.",
      icon: "fuel",
      image: "/azat/photos/734733361_1316050394076346_8245454663771609981_n.jpg",
      imageAlt: "Open Arizona Alpine Trail country with broad sky",
      coordinates: { lat: 34.2542, lng: -110.0298 },
      facts: [
        { label: "Services", value: "Fuel / Repairs" },
        { label: "Stop", value: "Resupply" },
      ],
    },
    {
      title: "Pine gateway",
      category: "Town",
      note: "A practical gateway where the trail experience meets food, fuel, and lodging.",
      icon: "trees",
      image: "/azat/photos/729540167_1313480850999967_3616790991404733595_n.jpg",
      imageAlt: "Dirt route through Arizona forest and grassland",
      coordinates: { lat: 34.3845, lng: -111.4557 },
      facts: [
        { label: "Town", value: "Pine" },
        { label: "Services", value: "Food / Fuel" },
      ],
    },
    {
      title: "Young resupply",
      category: "Resupply",
      note: "A quieter interior stop that makes the longer stretches easier to plan.",
      icon: "route",
      image: "/azat/photos/730171688_1313480387666680_2765511778839205017_n.jpg",
      imageAlt: "Arizona backcountry trail terrain with trees and ridgelines",
      coordinates: { lat: 34.1017, lng: -110.9635 },
      facts: [
        { label: "Stop", value: "Young" },
        { label: "Need", value: "Fuel check" },
      ],
    },
    {
      title: "Open high-country miles",
      category: "Scenic",
      note: "Long views, changing terrain, and the reason the map should feel like an invitation.",
      icon: "scenic",
      image: "/azat/photos/735761389_1318522053829180_4711200860303823554_n.jpg",
      imageAlt: "Aerial view of a dirt route winding through Arizona juniper country",
      coordinates: { lat: 34.2338, lng: -110.3031 },
      facts: [
        { label: "Terrain", value: "Open country" },
        { label: "File", value: "GPX ready" },
      ],
    },
  ],
  downloads: [
    { label: "Complete Trail GPX", value: "GPX", description: "V5 / Mar 21, 2026", href: "/downloads/arizona-alpine-trail-gpx" },
    { label: "Segment Overlay KML", value: "KML", description: "V5 / Mar 21, 2026", href: "/downloads/azat-segments-v5-kml" },
    { label: "GIS Shapefile", value: "SHP", description: "Planning archive", href: "/downloads/azat-shapefile" },
    { label: "Town Services Guide", value: "Guide", description: "Coming soon", href: "/resources" },
  ],
  itineraryTitle: "Rusty 1000",
  itineraryImage: "/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg",
  itineraryImageAlt: "Arizona Alpine Trail route terrain for Rusty 1000 itinerary",
  itineraryHref: "/rustys-route-1000",
  itineraryCards: [
    {
      title: "Rusty 1000",
      label: "Featured itinerary",
      href: "/rustys-route-1000",
      image: "/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg",
      imageAlt: "Arizona Alpine Trail route terrain for Rusty 1000 itinerary",
      miles: "1,000 mi",
      days: "11 days",
      status: "Available",
    },
  ],
  routeImage: "/azat/images/aspen-panorama.jpg",
  routeImageAlt: "Aspen forest trail in Arizona high country",
  routeTitle: "Carry the right file.",
  routeCopy:
    "The route files are the product: clean GPX, KML, and planning data that turn a beautiful idea into a ride you can prepare for.",
  rideChapters: [
    {
      type: "trailhead",
      eyebrow: "Trailhead arrival",
      title: "Start where the pavement gives way.",
      text:
        "The ride begins quietly: the first turn off the highway, tires settling into forest road, and the route opening ahead.",
      image: "/azat/ride/ride-trailhead.jpg",
      imageAlt: "Riders entering the Arizona Alpine Trail from a forest road trailhead",
      cta: { label: "Explore the trail", href: "/trail", variant: "text" },
    },
    {
      type: "landscape",
      eyebrow: "Moving through the landscape",
      title: "Let the country widen around you.",
      text:
        "The homepage should feel like forward motion through changing terrain: trees, overlooks, open sky, and the long pull between towns.",
      image: "/azat/ride/ride-forest.jpg",
      imageAlt: "Arizona high-country forest road with mountain light",
    },
    {
      type: "map",
      eyebrow: "Open navigation",
      title: "Turn the view into a ride plan.",
      text:
        "The real map becomes the moment where inspiration turns practical, with the route, towns, and files close enough to act on.",
      image: "/azat/ride/ride-map.jpg",
      imageAlt: "High-country trail view used as the navigation chapter backdrop",
      cta: { label: "Open the map", href: "#trail-map", variant: "text" },
    },
    {
      type: "download",
      eyebrow: "Pack the files",
      title: "Download before the signal drops.",
      text:
        "GPX, KML, and planning files are treated like essential gear: visible, clear, and ready before the ride leaves service.",
      image: "/azat/ride/ride-prepare.jpg",
      imageAlt: "Arizona alpine route landscape for route file preparation",
      cta: { label: "Download GPX", href: "/downloads/arizona-alpine-trail-gpx", variant: "text" },
    },
    {
      type: "towns",
      eyebrow: "Towns and services",
      title: "Use communities as anchors.",
      text:
        "Fuel, food, lodging, repairs, and resupply stops become part of the story instead of buried logistics.",
      image: "/azat/ride/ride-town.jpg",
      imageAlt: "Arizona Alpine Trail landscape near route communities and services",
      cta: { label: "Read resources", href: "/resources", variant: "text" },
    },
    {
      type: "stewardship",
      eyebrow: "Ride prepared",
      title: "Leave the route better than you found it.",
      text:
        "The final chapter brings riders back to responsibility: prepare well, respect access, and help protect the trail system as it grows.",
      image: "/azat/ride/ride-stewardship.jpg",
      imageAlt: "Open Arizona high-country route landscape for stewardship messaging",
      cta: { label: "Read resources", href: "/resources", variant: "text" },
    },
  ],
  timeline: [
    { day: "01", title: "Alpine to Greer", miles: "~100", fuel: "Eagar", lodging: "Lazy Trout Lodge" },
    { day: "02", title: "Greer to Show Low", miles: "~85", fuel: "Show Low", lodging: "Days Inn" },
    { day: "03", title: "Show Low to Heber", miles: "~100", fuel: "Show Low", lodging: "Sawmill Inn" },
    { day: "04", title: "Heber to Pine", miles: "~110", fuel: "Pine", lodging: "Strawberry Inn" },
    { day: "05", title: "Pine to Punkin Center", miles: "~80", fuel: "Punkin Center", lodging: "Local lodging" },
    { day: "06", title: "Punkin Center to Young", miles: "~75", fuel: "Young", lodging: "Book early" },
    { day: "07", title: "Young to Globe", miles: "~90", fuel: "Globe", lodging: "Service hub" },
    { day: "08", title: "Globe to Clifton", miles: "~105", fuel: "Clifton", lodging: "Mountain stay" },
    { day: "09", title: "Clifton to Alpine", miles: "~95", fuel: "Alpine", lodging: "High country" },
    { day: "10", title: "Alpine connectors", miles: "~70", fuel: "Alpine", lodging: "Base camp" },
    { day: "11", title: "Finish loop", miles: "~65", fuel: "Eagar", lodging: "Celebrate" },
  ],
  storyBlocks: [
    {
      eyebrow: "Discover",
      title: "Start with the shape of the trail.",
      text: "A quiet guidebook-style homepage introduces the full route first, then lets riders move into maps, segments, towns, and downloads at their own pace.",
      image: "/azat/images/trail-landscape.jpg",
      imageAlt: "Wide Arizona alpine landscape with open trail country",
      cta: { label: "View trail overview", href: "/trail", variant: "text" },
    },
    {
      eyebrow: "Plan",
      title: "Use towns as practical anchors.",
      text: "Fuel, food, lodging, repair, and resupply stops become part of the ride story instead of being buried in separate pages.",
      image: "/azat/images/trail-riders.jpg",
      imageAlt: "Riders gathered near the Arizona Alpine Trail route",
      cta: { label: "Read resources", href: "/resources", variant: "text" },
    },
    {
      eyebrow: "Protect",
      title: "Make stewardship visible.",
      text: "Safety, weather, land access, and responsible riding stay close to the map and downloads, where riders are already making decisions.",
      image: "/azat/images/aspen-panorama.jpg",
      imageAlt: "Aspen trees along a mountain trail",
      cta: { label: "Read resources", href: "/resources", variant: "text" },
    },
  ],
  resourceLinks: [
    { icon: "shield", title: "Safety", text: "Gear, weather, and ride-readiness." },
    { icon: "fuel", title: "Fuel", text: "Plan resupply before long stretches." },
    { icon: "map", title: "Navigation", text: "Download files before leaving service." },
    { icon: "trees", title: "Camping", text: "Know public-land rules and seasons." },
    { icon: "tools", title: "Repairs", text: "Find practical town services." },
  ],
  communityTitle: "Ride prepared. Leave it better.",
  communityCopy:
    "AZAT connects riders to the land, the route files, and the rural communities that make the journey possible.",
  communityImage: "/azat/images/trail-landscape.jpg",
  communityImageAlt: "Arizona alpine route landscape",
  communityStats: [
    { label: "Projected annual impact", value: "$38.6M" },
    { label: "Miles planned", value: "680+" },
    { label: "Communities connected", value: "23" },
    { label: "Acres of public land nearby", value: "2.3M+" },
  ],
  safetyTitle: "Ride Responsibly",
  safetyCards: [
    { icon: "shield", title: "OHV Safety", text: "Gear, speed, weather, and preparation guidance built into the planning flow." },
    { icon: "map", title: "Stay on Route", text: "Clear route families, waypoints, seasonal status, and downloadable files." },
    { icon: "trees", title: "Respect the Land", text: "Stewardship messages stay visible near maps, towns, and downloads." },
    { icon: "tools", title: "Plan Services", text: "Fuel, lodging, repairs, and town stops become practical ride planning data." },
  ],
  featuredNewsTitle: "Latest News",
  footerCtaTitle: "Plan the Ride. Protect the Route.",
  footerCtaCopy:
    "A Sanity-backed platform gives AZAT room to grow from launch content into maps, donations, products, memberships, and future rider services.",
};

function isLegacyRouteContent(data: HomePageData | null) {
  const routeText = `${data?.routeTitle || ""} ${data?.routeCopy || ""} ${data?.secondaryCta?.href || ""}`;
  return /rusty|route 1000|11 days|epic loop/i.test(routeText);
}

function isLegacyMapContent(data: HomePageData | null) {
  return /route families|official map data grows|living trail guide/i.test(data?.mapCopy || "");
}

function isLegacyHeroImage(data: HomePageData | null) {
  return /OHV_safety_aboutus|wp-content\/uploads\/2021\/11/i.test(data?.heroImage || "");
}

function normalizeDownloads(downloads: HomeDownload[] | undefined) {
  if (!downloads?.length) return fallbackHomePage.downloads;

  return downloads.map((download, index) => {
    const fallback =
      fallbackHomePage.downloads?.find((item) => item.value && item.value === download.value) ||
      fallbackHomePage.downloads?.[index];

    return {
      ...fallback,
      ...download,
      href: download.href || fallback?.href,
    };
  });
}

function normalizeTrailHighlights(highlights: HomeTrailHighlight[] | undefined) {
  const usableHighlights = highlights?.filter((highlight) => highlight.title && highlight.coordinates?.lat && highlight.coordinates?.lng);
  return usableHighlights?.length ? usableHighlights : fallbackHomePage.trailHighlights;
}

function normalizeItineraryCards(data: HomePageData) {
  if (data.itineraryCards?.length) return data.itineraryCards;

  if (data.itineraryTitle || data.itineraryImage || data.itineraryHref) {
    return [
      {
        ...fallbackHomePage.itineraryCards?.[0],
        title: data.itineraryTitle || fallbackHomePage.itineraryTitle || "Rusty 1000",
        href: data.itineraryHref || fallbackHomePage.itineraryHref,
        image: data.itineraryImage || fallbackHomePage.itineraryImage,
        imageAlt: data.itineraryImageAlt || fallbackHomePage.itineraryImageAlt,
      },
    ];
  }

  return fallbackHomePage.itineraryCards;
}

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const data = await sanityClient.fetch<HomePageData | null>(
      homePageQuery,
      {},
      process.env.NODE_ENV === "development" ? { cache: "no-store" } : { next: { revalidate: 30 } },
    );

    if (!data?.heroTitle) {
      return fallbackHomePage;
    }

    const legacyRouteContent = isLegacyRouteContent(data);
    const legacyMapContent = isLegacyMapContent(data);
    const legacyHeroImage = isLegacyHeroImage(data);

    return {
      ...fallbackHomePage,
      ...data,
      heroImage: legacyHeroImage ? fallbackHomePage.heroImage : data.heroImage || fallbackHomePage.heroImage,
      heroImageAlt: legacyHeroImage ? fallbackHomePage.heroImageAlt : data.heroImageAlt || fallbackHomePage.heroImageAlt,
      primaryCta: fallbackHomePage.primaryCta,
      secondaryCta: fallbackHomePage.secondaryCta,
      missionStatement: data.missionStatement || fallbackHomePage.missionStatement,
      missionAttribution: data.missionAttribution || fallbackHomePage.missionAttribution,
      missionImage: data.missionImage || fallbackHomePage.missionImage,
      missionImageAlt: data.missionImageAlt || fallbackHomePage.missionImageAlt,
      mapCopy: legacyMapContent ? fallbackHomePage.mapCopy : data.mapCopy || fallbackHomePage.mapCopy,
      mapLayers: legacyMapContent || !data.mapLayers?.length ? fallbackHomePage.mapLayers : data.mapLayers,
      trailHighlights: normalizeTrailHighlights(data.trailHighlights),
      downloads: normalizeDownloads(data.downloads),
      itineraryTitle: data.itineraryTitle || fallbackHomePage.itineraryTitle,
      itineraryImage: data.itineraryImage || fallbackHomePage.itineraryImage,
      itineraryImageAlt: data.itineraryImageAlt || fallbackHomePage.itineraryImageAlt,
      itineraryHref: data.itineraryHref || fallbackHomePage.itineraryHref,
      itineraryCards: normalizeItineraryCards(data),
      routeImage: legacyRouteContent ? fallbackHomePage.routeImage : data.routeImage || fallbackHomePage.routeImage,
      routeImageAlt: legacyRouteContent ? fallbackHomePage.routeImageAlt : data.routeImageAlt || fallbackHomePage.routeImageAlt,
      routeTitle: legacyRouteContent ? fallbackHomePage.routeTitle : data.routeTitle || fallbackHomePage.routeTitle,
      routeCopy: legacyRouteContent ? fallbackHomePage.routeCopy : data.routeCopy || fallbackHomePage.routeCopy,
      timeline: legacyRouteContent || !data.timeline?.length ? fallbackHomePage.timeline : data.timeline,
      rideChapters: data.rideChapters?.length ? data.rideChapters : fallbackHomePage.rideChapters,
      storyBlocks: data.storyBlocks?.length ? data.storyBlocks : fallbackHomePage.storyBlocks,
      resourceLinks: data.resourceLinks?.length ? data.resourceLinks : fallbackHomePage.resourceLinks,
      communityTitle: legacyRouteContent ? fallbackHomePage.communityTitle : data.communityTitle || fallbackHomePage.communityTitle,
      communityCopy: legacyRouteContent ? fallbackHomePage.communityCopy : data.communityCopy || fallbackHomePage.communityCopy,
      communityImage: legacyRouteContent ? fallbackHomePage.communityImage : data.communityImage || fallbackHomePage.communityImage,
      communityImageAlt: legacyRouteContent ? fallbackHomePage.communityImageAlt : data.communityImageAlt || fallbackHomePage.communityImageAlt,
      communityStats: data.communityStats?.length ? data.communityStats : fallbackHomePage.communityStats,
      safetyCards: data.safetyCards?.length ? data.safetyCards : fallbackHomePage.safetyCards,
      featuredNewsTitle: data.featuredNewsTitle || fallbackHomePage.featuredNewsTitle,
    };
  } catch {
    return fallbackHomePage;
  }
}
