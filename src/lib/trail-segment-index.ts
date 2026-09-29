import trailSegmentIndexData from "../../content/trail-segment-index.json";

// The trail's own numbering, 1-30 with 19 and 22 permanently unassigned (28 real segments).
// Names and GPX track ids are authoritative from protected-download-seed/current/arizona-alpine-trail.gpx.
// Pure data, no Node APIs — safe to import from client components (unlike trail-segments.ts, which
// touches the filesystem to load per-segment content and can't be bundled for the browser).
export const trailSegmentIndex: { number: number; name: string; gpxId: string; slug: string }[] = trailSegmentIndexData;

export function getTrailSegmentDisplayNumber(sourceNumber: number) {
  const index = trailSegmentIndex.findIndex((segment) => segment.number === sourceNumber);
  return index === -1 ? sourceNumber : index + 1;
}
