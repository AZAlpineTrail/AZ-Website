import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Download, FileDown } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getActiveDownloadBySlug } from "@/lib/downloads";
import { createSupabaseServerClient } from "@/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Download Ready",
  description: "Your Arizona Alpine Trail protected route file is ready.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DownloadThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token = "" } = await searchParams;
  const download = await getActiveDownloadBySlug(slug);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    redirect(`/sign-up?next=${encodeURIComponent(`/downloads/${slug}`)}`);
  }

  if (!download || !token) {
    redirect(`/downloads/${slug}`);
  }

  const downloadUrl = `/api/downloads/${download.slug}?token=${encodeURIComponent(token)}`;

  return (
    <>
      <Header />
      <main id="main" className="bg-[#f4f1e8] text-[#13221a]">
        <section className="mx-auto flex max-w-[1320px] items-start justify-center px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
            <div className="w-full max-w-2xl overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] text-[#13221a] shadow-[0_18px_44px_rgba(19,34,26,0.12)]">
              <div className="border-b border-[#d8ded4] bg-[#f8f4e8] p-5">
                <CheckCircle className="text-[#235840]" size={28} aria-hidden="true" />
                <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#b87939]">
                  Download ready
                </p>
                <h1 className="mt-2 text-2xl font-semibold leading-tight">
                  Your download is ready
                </h1>
              </div>
              <div className="p-5">
                <FileDown size={22} className="text-[#b74f32]" aria-hidden="true" />
                <p className="mt-4 text-xl font-semibold leading-tight">
                  {download.title}
                </p>
                {download.version ? (
                  <p className="mt-2 text-sm font-semibold text-[#5f6c63]">
                    {download.version}
                  </p>
                ) : null}
              </div>
              <div className="border-t border-[#d8ded4] p-5">
                <a
                  href={downloadUrl}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b74f32] px-6 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#9f432b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
                >
                  <Download size={17} aria-hidden="true" />
                  Download again
                </a>
                <Link
                  href="/resources"
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center text-sm font-bold text-[#235840] underline decoration-[#b87939]/40 underline-offset-4 transition hover:text-[#b74f32]"
                >
                  Back to resources
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
