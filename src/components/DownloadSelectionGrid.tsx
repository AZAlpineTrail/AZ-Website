"use client";

import { Download, PackageCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";

export type DownloadSelectionItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  fileType: string;
  ariaLabel: string;
  sharedLegNote?: string;
};

function DownloadCard({
  item,
  selected,
  onToggle,
}: {
  item: DownloadSelectionItem;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`rounded-sm border bg-[#fffdf7] p-5 transition ${
        selected ? "border-[#b74f32] shadow-[0_10px_28px_rgba(183,79,50,0.12)]" : "border-[#d8ded4]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm text-[#b74f32]">{item.fileType}</p>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-2 text-xs font-bold text-[#405047] hover:bg-[#f4f1e8]">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="size-5 accent-[#b74f32]"
            aria-label={`Select ${item.title}`}
          />
          Select
        </label>
      </div>
      <h3 className="mt-5 text-2xl font-semibold">{item.title}</h3>
      <p className="mt-2 text-[#5f6c63]">{item.subtitle}</p>
      {item.sharedLegNote ? (
        <p className="mt-3 text-sm font-semibold text-[#235840]">{item.sharedLegNote}</p>
      ) : null}
      <ProtectedDownloadLink
        href={`/downloads/${item.slug}`}
        fileType={item.fileType}
        ariaLabel={item.ariaLabel}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#13221a] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
      >
        <Download size={15} aria-hidden="true" />
        Download
      </ProtectedDownloadLink>
    </article>
  );
}

export function DownloadSelectionGrid({
  overallFiles,
  segmentFiles,
}: {
  overallFiles: DownloadSelectionItem[];
  segmentFiles: DownloadSelectionItem[];
}) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const allItems = useMemo(() => [...overallFiles, ...segmentFiles], [overallFiles, segmentFiles]);
  const selected = useMemo(() => new Set(selectedSlugs), [selectedSlugs]);

  const toggle = (slug: string) => {
    setSelectedSlugs((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  };

  const bundleHref = `/downloads/bulk?slugs=${encodeURIComponent(selectedSlugs.join(","))}`;

  return (
    <>
      <section aria-labelledby="overall-downloads">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="overall-downloads" className="text-2xl font-semibold text-[#13221a] sm:text-3xl">
              Overall trail files
            </h2>
            <p className="mt-2 text-sm text-[#5f6c63]">Select any combination, or download a single file as before.</p>
          </div>
          {allItems.length ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedSlugs(allItems.map((item) => item.slug))}
                className="min-h-10 rounded-full border border-[#d8ded4] px-4 text-xs font-bold uppercase tracking-[0.08em] text-[#13221a] hover:border-[#b74f32]"
              >
                Select all
              </button>
              {selectedSlugs.length ? (
                <button
                  type="button"
                  onClick={() => setSelectedSlugs([])}
                  className="min-h-10 rounded-full px-4 text-xs font-bold uppercase tracking-[0.08em] text-[#5f6c63] hover:text-[#b74f32]"
                >
                  Clear
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        {overallFiles.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {overallFiles.map((item) => (
              <DownloadCard key={item.id} item={item} selected={selected.has(item.slug)} onToggle={() => toggle(item.slug)} />
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
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5f6c63]">
          The official route has 30 numbered legs but 28 unique GPX files. Porter Mountain is used for legs 09 and 22;
          Little Colorado River is used for legs 11 and 19. Each shared segment only needs to be downloaded once.
        </p>
        {segmentFiles.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {segmentFiles.map((item) => (
              <DownloadCard key={item.id} item={item} selected={selected.has(item.slug)} onToggle={() => toggle(item.slug)} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-[#5f6c63]">Segment files aren&apos;t available right now — check back soon.</p>
        )}
      </section>

      {selectedSlugs.length ? (
        <div className="sticky bottom-4 z-20 mt-8 flex justify-center px-2">
          <div className="flex w-full max-w-xl flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[#f1b65a] bg-[#13221a] p-3 text-white shadow-[0_18px_50px_rgba(19,34,26,0.32)]">
            <p className="pl-2 text-sm font-semibold">
              {selectedSlugs.length} {selectedSlugs.length === 1 ? "file" : "files"} selected
            </p>
            <ProtectedDownloadLink
              href={bundleHref}
              ariaLabel={`Review terms and download ${selectedSlugs.length} selected files`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f1b65a] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#13221a] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PackageCheck size={17} aria-hidden="true" />
              Download selected
            </ProtectedDownloadLink>
          </div>
        </div>
      ) : null}
    </>
  );
}
