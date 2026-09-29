import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import { gatedDownloadHref, listActiveDownloads, type DownloadFile } from "@/lib/downloads";
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

function DownloadCard({
  item,
  title,
  subtitle,
  ariaLabel,
}: {
  item: DownloadFile;
  title: string;
  subtitle?: string;
  ariaLabel: string;
}) {
  return (
    <article className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
      <p className="font-mono text-sm text-[#b74f32]">{item.file_type}</p>
      <h3 className="mt-8 text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-[#5f6c63]">{subtitle ?? item.version ?? ""}</p>
      <ProtectedDownloadLink
        href={gatedDownloadHref(item.slug)}
        ariaLabel={ariaLabel}
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#13221a] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
      >
        Download
      </ProtectedDownloadLink>
    </article>
  );
}

export default async function DownloadsPage() {
  const files = await listActiveDownloads();
  const segmentBySlug = new Map(trailSegmentIndex.map((segment) => [`${segment.slug}-gpx`, segment]));

  const segmentFiles = files
    .filter((file) => segmentBySlug.has(file.slug))
    .map((file) => ({ file, segment: segmentBySlug.get(file.slug)! }))
    .sort((a, b) => a.segment.number - b.segment.number);

  const overallFiles = files.filter((file) => !segmentBySlug.has(file.slug));

  return (
    <PageShell
      title="Downloads"
      description="The complete trail files and every individual segment's GPX, in one place. This list updates automatically as new files are published — no need to look anywhere else."
    >
      <section aria-labelledby="overall-downloads">
        <h2 id="overall-downloads" className="text-2xl font-semibold text-[#13221a] sm:text-3xl">
          Overall trail files
        </h2>
        {overallFiles.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {overallFiles.map((file) => (
              <DownloadCard key={file.id} item={file} title={file.title} ariaLabel={`Download ${file.title}`} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-[#5f6c63]">Trail files aren&apos;t available right now — check back soon.</p>
        )}
      </section>

      <section aria-labelledby="segment-downloads" className="mt-16 border-t border-[#d8ded4] pt-10">
        <h2 id="segment-downloads" className="text-2xl font-semibold text-[#13221a] sm:text-3xl">
          Segment files
        </h2>
        {segmentFiles.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {segmentFiles.map(({ file, segment }) => {
              const displayNumber = getTrailSegmentDisplayNumber(segment.number);
              return (
                <DownloadCard
                  key={file.id}
                  item={file}
                  title={`${displayNumber} · ${segment.name}`}
                  subtitle={file.version ?? undefined}
                  ariaLabel={`Download segment ${displayNumber}, ${segment.name}`}
                />
              );
            })}
          </div>
        ) : (
          <p className="mt-6 text-[#5f6c63]">Segment files aren&apos;t available right now — check back soon.</p>
        )}
      </section>
    </PageShell>
  );
}
