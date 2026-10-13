import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Download, FileArchive } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createSupabaseServerClient } from "@/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Selected Downloads Ready",
  description: "Your selected Arizona Alpine Trail route files are ready.",
  robots: { index: false, follow: false },
};

export default async function BulkDownloadThanksPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) redirect("/downloads");
  if (!token) redirect("/downloads");

  const downloadUrl = `/api/downloads/bulk?token=${encodeURIComponent(token)}`;

  return (
    <>
      <Header />
      <main id="main" className="bg-[#f4f1e8] text-[#13221a]">
        <section className="mx-auto flex max-w-[1320px] items-start justify-center px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
          <div className="w-full max-w-2xl overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] shadow-[0_18px_44px_rgba(19,34,26,0.12)]">
            <div className="border-b border-[#d8ded4] bg-[#f8f4e8] p-5">
              <CheckCircle className="text-[#235840]" size={28} aria-hidden="true" />
              <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#b87939]">ZIP ready</p>
              <h1 className="mt-2 text-2xl font-semibold leading-tight">Your selected files are ready</h1>
            </div>
            <div className="p-5">
              <FileArchive size={24} className="text-[#b74f32]" aria-hidden="true" />
              <p className="mt-4 text-[#5f6c63]">The ZIP download should begin automatically.</p>
            </div>
            <div className="border-t border-[#d8ded4] p-5">
              <a href={downloadUrl} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b74f32] px-6 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#9f432b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]">
                <Download size={17} aria-hidden="true" />
                Download ZIP again
              </a>
              <Link href="/downloads" className="mt-4 inline-flex min-h-10 w-full items-center justify-center text-sm font-bold text-[#235840] underline decoration-[#b87939]/40 underline-offset-4 hover:text-[#b74f32]">
                Back to downloads
              </Link>
            </div>
          </div>
          <iframe src={downloadUrl} title="" className="hidden" />
        </section>
      </main>
      <Footer />
    </>
  );
}
