import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

// Loads a segment's page content from one folder per segment, so a new segment never requires
// touching app code:
//   public/azat/segments/<slug>/content.json          — narrative fields
//   public/azat/segments/<slug>/photos/hero.*          — hero photo
//   public/azat/segments/<slug>/photos/map.*           — route-map graphic (optional)
//   public/azat/segments/<slug>/photos/gallery/*.*     — gallery photos, any count
// Shared as plain ESM (not TS) so both the Next.js app (src/lib/trail-segments.ts) and the
// Node seed script (scripts/seed-sanity.mjs) load segments the same way from one place.

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function toPublicUrl(publicDir, absPath) {
  return "/" + relative(publicDir, absPath).split(sep).join("/");
}

function findNamedImage(dir, baseName) {
  for (const ext of IMAGE_EXTENSIONS) {
    const candidate = join(dir, `${baseName}${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function humanizeGalleryFilename(fileName) {
  const base = fileName.slice(0, -extname(fileName).length);
  const withoutPrefix = base.replace(/^\d+[-_]*/, "");
  const words = withoutPrefix.replace(/[-_]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "Trail photo";
}

function segmentDirFor(slug, publicDir) {
  return join(publicDir, "azat", "segments", slug);
}

function readSegmentImages(slug, publicDir, name) {
  const photosDir = join(segmentDirFor(slug, publicDir), "photos");
  const galleryDir = join(photosDir, "gallery");

  const heroPath = findNamedImage(photosDir, "hero");
  const mapPath = findNamedImage(photosDir, "map");

  const galleryFiles = existsSync(galleryDir)
    ? readdirSync(galleryDir)
        .filter((file) => IMAGE_EXTENSIONS.includes(extname(file).toLowerCase()))
        .sort()
    : [];

  return {
    heroImage: heroPath ? toPublicUrl(publicDir, heroPath) : undefined,
    heroImageAlt: heroPath ? `${name} trail hero photo` : undefined,
    mapImage: mapPath ? toPublicUrl(publicDir, mapPath) : undefined,
    mapImageAlt: mapPath ? `${name} route map` : undefined,
    gallery: galleryFiles.map((file) => ({
      url: toPublicUrl(publicDir, join(galleryDir, file)),
      alt: humanizeGalleryFilename(file),
      fileName: file,
    })),
  };
}

function readSegmentContentJson(slug, publicDir) {
  const filePath = join(segmentDirFor(slug, publicDir), "content.json");
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function listSegmentContentSlugs(publicDir) {
  const segmentsRoot = join(publicDir, "azat", "segments");
  if (!existsSync(segmentsRoot)) return [];
  return readdirSync(segmentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .filter((slug) => existsSync(join(segmentsRoot, slug, "content.json")));
}

// Builds one segment's page data from its content.json + photos/ folder. Returns null when
// there's no content.json yet — that's what marks a segment "not published" (a photo folder
// alone doesn't publish a page; content.json is the switch).
export function buildSegmentPageData(indexEntry, { publicDir }) {
  const {
    slug,
    name,
    number,
    lengthMiles,
    minElevationFeet,
    maxElevationFeet,
    elevationGainFeet,
    elevationLossFeet,
    trailRating,
  } = indexEntry;
  const json = readSegmentContentJson(slug, publicDir);
  if (!json) return null;

  const images = readSegmentImages(slug, publicDir, name);
  const gallery = images.gallery.map(({ url, alt, fileName }) => ({
    url,
    alt: json.galleryAlt?.[fileName] ?? alt,
  }));

  const downloads = json.downloads ?? [
    {
      title: `${name} GPX`,
      slug: { current: `${slug}-gpx` },
      fileType: "GPX",
      notes: json.downloadNotes ?? `Individual GPX download for the ${name} segment.`,
    },
  ];

  return {
    title: name,
    slug: { current: slug },
    segmentCode: String(number).padStart(2, "0"),
    segmentNumber: number,
    status: json.status,
    lengthMiles,
    minElevationFeet,
    maxElevationFeet,
    elevationGainFeet,
    elevationLossFeet,
    trailRating,
    downloads,
    heroImage: images.heroImage,
    heroImageAlt: json.heroAlt ?? images.heroImageAlt,
    mapImage: images.mapImage,
    mapImageAlt: json.mapAlt ?? images.mapImageAlt,
    descriptionBody: Array.isArray(json.descriptionBody) ? json.descriptionBody.join("\n\n") : json.descriptionBody,
    amenities: json.amenities,
    amenitiesNote: json.amenitiesNote,
    safetyNote: json.safetyNote,
    pointsOfInterest: json.pointsOfInterest,
    gallery,
    lastVerifiedAt: json.lastVerifiedAt,
    seo: json.seo,
  };
}

export function loadAllSegmentPageData(segmentIndex, { publicDir }) {
  const bySlug = {};
  for (const entry of segmentIndex) {
    const data = buildSegmentPageData(entry, { publicDir });
    if (data) bySlug[entry.slug] = data;
  }
  return bySlug;
}
