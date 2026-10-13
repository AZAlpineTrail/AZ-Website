import trailSegmentIndexData from "../../content/trail-segment-index.json";

// The trail's 30-step loop uses 28 unique GPX segments. Porter Mountain is traversed as
// steps 09 and 22, while Little Colorado River is traversed as steps 11 and 19.
// Names and primary GPX track ids are authoritative from protected-download-seed/current/arizona-alpine-trail.gpx.
// Pure data, no Node APIs — safe to import from client components (unlike trail-segments.ts, which
// touches the filesystem to load per-segment content and can't be bundled for the browser).
export type TrailSegmentIndexEntry = {
  number: number;
  name: string;
  gpxId: string;
  slug: string;
  loopNumbers: number[];
  lengthMiles: number;
  minElevationFeet: number;
  maxElevationFeet: number;
  elevationGainFeet: number;
  elevationLossFeet: number;
  trailRating: "easier-green" | "more-difficult-blue" | "most-difficult-black";
};

export const trailSegmentIndex = trailSegmentIndexData as TrailSegmentIndexEntry[];

export function getTrailSegmentDisplayNumber(sourceNumber: number) {
  const segment = trailSegmentIndex.find((entry) => entry.number === sourceNumber);
  const loopNumbers = segment?.loopNumbers ?? [sourceNumber];
  return loopNumbers.map((number) => number.toString().padStart(2, "0")).join("/");
}
