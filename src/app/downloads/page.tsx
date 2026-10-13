import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { DownloadSelectionGrid, type DownloadSelectionItem } from "@/components/DownloadSelectionGrid";
import { listActiveDownloads } from "@/lib/downloads";
import { getTrailSegmentDisplayNumber, trailSegmentIndex } from "@/lib/trail-segment-index";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Every current Arizona Alpine Trail download in one place — the complete trail files and every individual segment.",
  alternates: { canonical: "/downloads" },
  openGraph: {
    title: "Arizona Alpine Trail Downloads",
    description: "The complete trail GPX and KML files plus every individual segment's GPX file.",
    url: "/downloads",
  },
};

export default async function DownloadsPage() {
  const files = await listActiveDownloads();
  const segmentBySlug = new Map(trailSegmentIndex.map((segment) => [`${segment.slug}-gpx`, segment]));

  const segmentFiles = files
    .filter((file) => segmentBySlug.has(file.slug))
    .map((file) => ({ file, segment: segmentBySlug.get(file.slug)! }))
    .sort((a, b) => a.segment.number - b.segment.number);

  const overallFiles = files.filter((file) => !segmentBySlug.has(file.slug));
  const overallItems: DownloadSelectionItem[] = overallFiles.map((file) => ({
    id: file.id,
    slug: file.slug,
    title: file.title,
    subtitle: file.version ?? "Current",
    fileType: file.file_type,
    ariaLabel: `Download ${file.title}`,
  }));
  const segmentItems: DownloadSelectionItem[] = segmentFiles.map(({ file, segment }) => {
    const displayNumber = getTrailSegmentDisplayNumber(segment.number);
    return {
      id: file.id,
      slug: file.slug,
      title: `${displayNumber} · ${segment.name}`,
      subtitle: file.version ?? "Current",
      fileType: file.file_type,
      ariaLabel: `Download segment ${displayNumber}, ${segment.name}`,
      sharedLegNote: segment.loopNumbers.length > 1 ? `One GPX file used for legs ${segment.loopNumbers.join(" and ")}` : undefined,
    };
  });

  return (
    <PageShell
      title="Downloads"
      description="The complete trail files and every individual segment's GPX, in one place. This list updates automatically as new files are published — no need to look anywhere else."
    >
      <DownloadSelectionGrid overallFiles={overallItems} segmentFiles={segmentItems} />
    </PageShell>
  );
}
