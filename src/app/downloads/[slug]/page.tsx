import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, FileCheck2, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  DOWNLOAD_TERMS_VERSION,
  getActiveDownloadBySlug,
  termsParagraphs,
} from "@/lib/downloads";
import { createSupabaseServerClient } from "@/supabase/server";
import { agreeToDownloadTerms } from "@/app/downloads/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Download Trail File",
  description: "Review Arizona Alpine Trail terms before downloading a protected route file.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DownloadTermsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ auth?: string; next?: string }>;
}) {
  const { slug } = await params;
  const authQuery = await searchParams;
  const download = await getActiveDownloadBySlug(slug);

  if (!download) {
    redirect("/resources");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    const next = `/downloads/${slug}`;

    if (authQuery.auth !== "sign-up" || authQuery.next !== next) {
      redirect(`/downloads/${slug}?auth=sign-up&next=${encodeURIComponent(next)}`);
    }

    return (
      <>
        <Header />
        <main id="main" className="min-h-[calc(100svh-60px)] bg-[#f4f1e8] text-[#13221a]" />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main" className="bg-[#f4f1e8] text-[#13221a]">
        <section className="mx-auto max-w-[1320px] px-5 pb-2 pt-28 sm:px-8 lg:pt-32">
            <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-[0.98] tracking-normal text-[#13221a] sm:text-5xl">
              Terms and Conditions of Use
            </h1>
        </section>

        <div className="mx-auto grid max-w-[1320px] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:py-12">
          <aside className="order-first lg:sticky lg:top-24 lg:order-last">
            <div className="overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] shadow-[0_18px_44px_rgba(19,34,26,0.12)]">
              <div className="border-b border-[#d8ded4] bg-[#f8f4e8] p-5">
                <FileCheck2 size={22} className="text-[#b74f32]" aria-hidden="true" />
                <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#b87939]">
                  File request
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight">
                  {download.title}
                </h2>
              </div>
              <dl className="grid gap-0 p-5">
                <div className="flex items-center justify-between gap-4 border-b border-[#d8ded4] py-3">
                  <dt className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#8a958c]">Type</dt>
                  <dd className="text-sm font-semibold">{download.file_type}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[#d8ded4] py-3">
                  <dt className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#8a958c]">Version</dt>
                  <dd className="text-right text-sm font-semibold">{download.version || "Current"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#8a958c]">Terms</dt>
                  <dd className="text-right text-xs font-semibold text-[#5f6c63]">{DOWNLOAD_TERMS_VERSION}</dd>
                </div>
              </dl>
              <div className="border-t border-[#d8ded4] p-5">
                <form action={agreeToDownloadTerms}>
                  <input type="hidden" name="slug" value={download.slug} />
                  <button
                    type="submit"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b74f32] px-6 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#9f432b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
                  >
                    <Download size={17} aria-hidden="true" />
                    I Agree and Download
                  </button>
                </form>
                <Link
                  href="/resources"
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center text-sm font-bold text-[#235840] underline decoration-[#b87939]/40 underline-offset-4 transition hover:text-[#b74f32]"
                >
                  Cancel and return to resources
                </Link>
              </div>
            </div>
          </aside>

          <article className="border-y border-[#d8ded4] bg-[#fffdf7] px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex items-start gap-3 text-[#173d2b]">
              <ShieldCheck className="mt-1 shrink-0 text-[#b74f32]" aria-hidden="true" />
              <div>
                <h2 className="text-2xl font-semibold">Arizona Alpine Trail</h2>
                <p className="mt-1 font-mono text-xs font-black uppercase tracking-[0.16em] text-[#b87939]">
                  General Disclaimer; Assumption of Risk; Release and Hold Harmless
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-5 text-base leading-7 text-[#293b31]">
              {termsParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#8a958c]">
              Terms version: {DOWNLOAD_TERMS_VERSION}
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
