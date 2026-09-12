import { defineField, defineType } from "sanity";

const slug = defineField({
  name: "slug",
  type: "slug",
  options: { source: "title", maxLength: 96 },
  validation: (Rule) => Rule.required(),
});

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({ name: "hero", type: "hero" }),
    defineField({ name: "body", type: "richText" }),
    defineField({ name: "seo", type: "seo" }),
  ],
});

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Arizona Alpine Trail Home" }),
    defineField({ name: "heroTitle", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroCopy", type: "text", rows: 3 }),
    defineField({ name: "heroImage", type: "externalImage" }),
    defineField({ name: "primaryCta", type: "cta" }),
    defineField({ name: "secondaryCta", type: "cta" }),
    defineField({ name: "missionStatement", title: "Mission Statement", type: "text", rows: 4 }),
    defineField({ name: "missionAttribution", title: "Mission Attribution", type: "string" }),
    defineField({ name: "missionImage", title: "Mission Background Image", type: "externalImage" }),
    defineField({ name: "mapTitle", type: "string" }),
    defineField({ name: "mapCopy", type: "text", rows: 3 }),
    defineField({ name: "trailHighlights", title: "Trail Highlights", type: "array", of: [{ type: "trailHighlight" }] }),
    defineField({ name: "downloads", type: "array", of: [{ type: "labeledItem" }] }),
    defineField({ name: "itineraryTitle", title: "Itinerary Card Title", type: "string" }),
    defineField({ name: "itineraryImage", title: "Itinerary Card Image", type: "externalImage" }),
    defineField({ name: "itineraryHref", title: "Itinerary Card Link", type: "string" }),
    defineField({ name: "itineraryCards", title: "Itinerary Cards", type: "array", of: [{ type: "itineraryCard" }] }),
    defineField({ name: "mapLayers", type: "array", of: [{ type: "mapLayer" }], hidden: true }),
    defineField({ name: "routeImage", type: "externalImage", hidden: true }),
    defineField({ name: "routeTitle", type: "string", hidden: true }),
    defineField({ name: "routeCopy", type: "text", rows: 3, hidden: true }),
    defineField({ name: "timeline", type: "array", of: [{ type: "timelineStop" }], hidden: true }),
    defineField({
      name: "rideChapters",
      title: "Ride Chapters",
      description: "Photo-led homepage chapters that create the forward trail ride experience.",
      type: "array",
      of: [{ type: "rideChapter" }],
      hidden: true,
    }),
    defineField({ name: "storyBlocks", title: "Trail Story Blocks", type: "array", of: [{ type: "homeStoryBlock" }], hidden: true }),
    defineField({ name: "resourceLinks", title: "Resource Links", type: "array", of: [{ type: "iconCard" }], hidden: true }),
    defineField({ name: "communityTitle", type: "string", hidden: true }),
    defineField({ name: "communityCopy", type: "text", rows: 3, hidden: true }),
    defineField({ name: "communityImage", type: "externalImage", hidden: true }),
    defineField({ name: "communityStats", type: "array", of: [{ type: "labeledItem" }], hidden: true }),
    defineField({ name: "safetyTitle", type: "string", hidden: true }),
    defineField({ name: "safetyCards", type: "array", of: [{ type: "iconCard" }], hidden: true }),
    defineField({
      name: "featuredNewsTitle",
      title: "News Section Title",
      description: "Heading above the homepage news strip. The 3 most recent News Posts show automatically — nothing else to configure here.",
      type: "string",
    }),
    defineField({ name: "footerCtaTitle", type: "string", hidden: true }),
    defineField({ name: "footerCtaCopy", type: "text", rows: 3, hidden: true }),
    defineField({ name: "seo", type: "seo" }),
  ],
});

export const newsPost = defineType({
  name: "newsPost",
  title: "News Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          "Trip Reports",
          "Trail Updates",
          "Community & Events",
          "Safety & Stewardship",
          "Partner & Agency News",
          "In the Press",
        ],
      },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Shows on the news list and homepage cards. 1-2 sentences.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      description: "Posts with a future date won't appear on the site until that date.",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "heroImage", title: "Hero Photo", type: "externalImage" }),
    defineField({
      name: "heroImageContain",
      title: "Don't crop hero image",
      description: "Turn on for a logo or graphic that shouldn't be cropped to fill the frame.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "body", title: "Body", type: "richText", validation: (Rule) => Rule.required() }),
    defineField({
      name: "source",
      title: "Press / Attribution",
      description: "Fill this in only when reprinting or citing outside coverage (a newspaper or magazine feature).",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Publication", type: "string" }),
        defineField({ name: "url", title: "Link to full story", type: "url" }),
        defineField({ name: "reporter", title: "Reporter", type: "string" }),
        defineField({ name: "photoCredit", title: "Photo Credit", type: "string" }),
      ],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [
    {
      title: "Publish date, new to old",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "heroImage.image" },
  },
});

export const town = defineType({
  name: "town",
  title: "Town",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "coordinates", type: "mapCoordinates" }),
    defineField({
      name: "services",
      type: "array",
      of: [{ type: "string" }],
      options: { list: ["Fuel", "Lodging", "Food", "Repairs", "Groceries", "Trail Access"] },
    }),
    defineField({ name: "body", type: "richText" }),
    defineField({ name: "seo", type: "seo" }),
  ],
});

export const waypoint = defineType({
  name: "waypoint",
  title: "Waypoint",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({
      name: "type",
      type: "string",
      options: { list: ["Fuel", "Lodging", "Food", "Scenic", "Trailhead", "Hazard", "Repair"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "coordinates", type: "mapCoordinates", validation: (Rule) => Rule.required() }),
    defineField({ name: "notes", type: "text", rows: 3 }),
  ],
});

export const downloadFile = defineType({
  name: "downloadFile",
  title: "Download File",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({
      name: "fileType",
      type: "string",
      options: { list: ["GPX", "KML", "KMZ", "SHP", "PDF", "Image", "Other"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "version", type: "string" }),
    defineField({ name: "publishedAt", type: "date" }),
    defineField({ name: "file", type: "file" }),
    defineField({ name: "externalUrl", type: "url" }),
    defineField({ name: "notes", type: "text", rows: 3 }),
  ],
});

export const trailSegment = defineType({
  name: "trailSegment",
  title: "Trail Segment",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({ name: "segmentCode", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "segmentNumber",
      title: "Segment Number",
      description: "The trail's own numbering (1-30; 19 and 22 are retired and never assigned). Drives ordering and prev/next.",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(30).integer(),
    }),
    defineField({ name: "status", type: "string", options: { list: ["Proposed", "Preliminary", "Open", "Seasonal", "Closed"] } }),
    defineField({ name: "lengthMiles", title: "Length (miles)", type: "number" }),
    defineField({ name: "minElevationFeet", title: "Minimum Elevation (ft)", type: "number" }),
    defineField({ name: "maxElevationFeet", title: "Maximum Elevation (ft)", type: "number" }),
    defineField({ name: "elevationGainFeet", title: "Elevation Gain (ft)", type: "number" }),
    defineField({ name: "elevationLossFeet", title: "Elevation Loss (ft)", type: "number" }),
    defineField({
      name: "trailRating",
      title: "Trail Rating",
      description: "AZAT's official difficulty rating for this segment.",
      type: "string",
      options: {
        list: [
          { title: "Easier / Green", value: "easier-green" },
          { title: "More Difficult / Blue", value: "more-difficult-blue" },
          { title: "Most Difficult / Black", value: "most-difficult-black" },
        ],
      },
    }),
    defineField({ name: "startTown", type: "reference", to: [{ type: "town" }] }),
    defineField({ name: "endTown", type: "reference", to: [{ type: "town" }] }),
    defineField({ name: "waypoints", type: "array", of: [{ type: "reference", to: [{ type: "waypoint" }] }] }),
    defineField({ name: "downloads", type: "array", of: [{ type: "reference", to: [{ type: "downloadFile" }] }] }),
    defineField({ name: "heroImage", title: "Hero Photo", type: "externalImage" }),
    defineField({
      name: "mapImage",
      title: "Route Map Graphic",
      description: "An official AZAT route-map graphic (topo + legend). When set, this replaces the interactive map on the segment page.",
      type: "externalImage",
    }),
    defineField({
      name: "descriptionBody",
      title: "Description",
      description: "The route narrative: junctions/roads, forest, landmarks, terrain, vehicle recommendation.",
      type: "richText",
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      description: "Categories confirmed available on or near this segment.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: ["Food", "Fuel", "Lodging", "Medical", "Potable Water", "Restroom", "Parking/Staging", "Repair"],
      },
    }),
    defineField({
      name: "amenitiesNote",
      title: "Amenities Note",
      description: "The real, specific prose (e.g. which towns offer what) — always shown alongside the amenities legend.",
      type: "text",
      rows: 4,
    }),
    defineField({ name: "safetyNote", title: "Safety Note", type: "text", rows: 3 }),
    defineField({
      name: "pointsOfInterest",
      title: "Points of Interest",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      of: [{ type: "externalImage" }],
    }),
    defineField({
      name: "lastVerifiedAt",
      title: "Last Verified",
      description: "When AZAT last confirmed this segment's facts and route data.",
      type: "date",
    }),
    defineField({ name: "body", type: "richText" }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "status",
    },
  },
});

export const itineraryDay = defineType({
  name: "itineraryDay",
  title: "Itinerary Day",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "dayNumber", type: "number", validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: "startTown", type: "reference", to: [{ type: "town" }] }),
    defineField({ name: "endTown", type: "reference", to: [{ type: "town" }] }),
    defineField({ name: "mileage", type: "number" }),
    defineField({ name: "fuelNotes", type: "string" }),
    defineField({ name: "lodgingNotes", type: "string" }),
    defineField({ name: "body", type: "richText" }),
  ],
});

export const route = defineType({
  name: "route",
  title: "Route",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "stats", type: "routeStats" }),
    defineField({ name: "routeFamily", type: "string", options: { list: ["A Route", "B Route", "Rusty 1000", "Custom"] } }),
    defineField({ name: "segments", type: "array", of: [{ type: "reference", to: [{ type: "trailSegment" }] }] }),
    defineField({ name: "itineraryDays", type: "array", of: [{ type: "reference", to: [{ type: "itineraryDay" }] }] }),
    defineField({ name: "downloads", type: "array", of: [{ type: "reference", to: [{ type: "downloadFile" }] }] }),
    defineField({ name: "body", type: "richText" }),
    defineField({ name: "seo", type: "seo" }),
  ],
});

export const rustysRoutePage = defineType({
  name: "rustysRoutePage",
  title: "Rusty's Route Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Rusty 1000" }),
    defineField({ name: "heroKicker", title: "Hero Kicker", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroCopy", title: "Hero Copy", type: "text", rows: 2 }),
    defineField({ name: "heroImage", title: "Hero Scenic Image", type: "externalImage" }),
    defineField({
      name: "facts",
      title: "Hero Facts",
      type: "array",
      of: [{ type: "labeledItem" }],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({ name: "downloadCta", title: "Download CTA", type: "cta" }),
    defineField({ name: "overviewKicker", title: "Map Section Kicker", type: "string" }),
    defineField({ name: "overviewTitle", title: "Map Section Title", type: "string" }),
    defineField({ name: "overviewCopy", title: "Map Section Copy", type: "text", rows: 2 }),
    defineField({
      name: "mapHighlights",
      title: "Map Town Highlights",
      description: "Town and lodging/fuel markers shown on the route overview map.",
      type: "array",
      of: [{ type: "trailHighlight" }],
    }),
    defineField({ name: "planningKicker", title: "Know Before You Go Kicker", type: "string" }),
    defineField({
      name: "planningNotes",
      title: "Know Before You Go Notes",
      type: "array",
      of: [{ type: "rustysRoutePlanningNote" }],
    }),
    defineField({ name: "itineraryKicker", title: "Itinerary Kicker", type: "string" }),
    defineField({ name: "itineraryTitle", title: "Itinerary Title", type: "string" }),
    defineField({ name: "lodgingNote", title: "Lodging Note", type: "text", rows: 2 }),
    defineField({
      name: "itineraryDays",
      title: "Itinerary Days",
      type: "array",
      of: [{ type: "rustysRouteDay" }],
    }),
    defineField({ name: "finalCtaKicker", title: "Final CTA Kicker", type: "string" }),
    defineField({ name: "finalCtaTitle", title: "Final CTA Title", type: "string" }),
    defineField({ name: "finalCtaImage", title: "Final CTA Background Image", type: "externalImage" }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "heroTitle",
    },
  },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "answer", type: "richText" }),
    defineField({ name: "category", type: "string" }),
  ],
});

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "file", type: "reference", to: [{ type: "downloadFile" }] }),
  ],
});

export const sponsorPartner = defineType({
  name: "sponsorPartner",
  title: "Sponsor / Partner",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "stripePriceId", type: "string" }),
    defineField({ name: "active", type: "boolean", initialValue: false }),
  ],
});

export const donationCampaign = defineType({
  name: "donationCampaign",
  title: "Donation Campaign",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    slug,
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "suggestedAmounts", type: "array", of: [{ type: "number" }] }),
    defineField({ name: "stripePriceId", type: "string" }),
    defineField({ name: "active", type: "boolean", initialValue: false }),
  ],
});

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({ name: "source", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "destination", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "permanent", type: "boolean", initialValue: true }),
  ],
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Arizona Alpine Trail" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "primaryNavigation", type: "array", of: [{ type: "cta" }] }),
    defineField({ name: "footerNavigation", type: "array", of: [{ type: "cta" }] }),
    defineField({ name: "featuredRoute", type: "reference", to: [{ type: "route" }] }),
    defineField({ name: "featuredDownloads", type: "array", of: [{ type: "reference", to: [{ type: "downloadFile" }] }] }),
  ],
});
