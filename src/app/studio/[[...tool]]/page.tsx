import type { Metadata } from "next";
import { SanityStudio } from "@/components/SanityStudio";
import { hasConfiguredSanityProject } from "@/sanity/env";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioPage() {
  if (!hasConfiguredSanityProject) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f8f4] px-5 text-[#13221a]">
        <section className="max-w-2xl rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-8 shadow-[0_24px_80px_rgba(19,34,26,0.10)]">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#b74f32]">
            Sanity setup required
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">Connect a Sanity project</h1>
          <p className="mt-4 text-lg leading-8 text-[#5f6c63]">
            Add `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and
            `NEXT_PUBLIC_SANITY_API_VERSION` from `.env.example`, then restart the dev server to
            open the Studio.
          </p>
        </section>
      </main>
    );
  }

  return <SanityStudio />;
}
