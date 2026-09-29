import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NewsBody } from "@/components/NewsBody";
import { PageShell } from "@/components/PageShell";
import { estimateReadMinutes, formatNewsDate, getNewsPostBySlug } from "@/lib/news";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.seo?.title || `${post.title} | Arizona Alpine Trail News`,
    description: post.seo?.description || post.excerpt,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `/news/${slug}`,
      images: post.seo?.image || post.heroImage ? [post.seo?.image || post.heroImage!] : undefined,
    },
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) notFound();

  const readMinutes = estimateReadMinutes(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.heroImage ? [post.heroImage] : undefined,
    author: post.source?.reporter
      ? { "@type": "Person", name: post.source.reporter }
      : { "@type": "Organization", name: "Arizona Alpine Trail" },
    publisher: {
      "@type": "Organization",
      name: "Arizona Alpine Trail",
      logo: { "@type": "ImageObject", url: "/azat/brand/azat-logo.png" },
    },
  };

  return (
    <PageShell title={post.title} description={post.excerpt}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-wide text-[#5f6c63]">
        {post.category ? (
          <>
            <span className="text-[#b74f32]">{post.category}</span>
            <span aria-hidden>·</span>
          </>
        ) : null}
        <span>{formatNewsDate(post.date)}</span>
        {readMinutes ? (
          <>
            <span aria-hidden>·</span>
            <span>{readMinutes} min read</span>
          </>
        ) : null}
      </div>

      {post.heroImage ? (
        <div
          className={`mt-8 overflow-hidden rounded-sm border border-[#d8ded4] ${post.heroImageContain ? "bg-[#fffdf7] p-10" : ""}`}
        >
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt ?? post.title}
            width={1200}
            height={960}
            priority
            className={`h-auto w-full ${post.heroImageContain ? "object-contain" : "object-cover"}`}
          />
        </div>
      ) : null}

      <article className="mt-10 max-w-[700px] space-y-6 text-lg leading-8 text-[#13221a]">
        <NewsBody body={post.body} />
      </article>

      {post.source ? (
        <div className="mt-10 max-w-[700px] border-t border-[#d8ded4] pt-6">
          {post.source.url ? (
            <p className="rounded-sm bg-[#f8f4e8] px-4 py-3 text-sm text-[#13221a]">
              Read the full story at the{" "}
              <a
                href={post.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#b74f32] underline"
              >
                {post.source.label}
              </a>
              .
            </p>
          ) : null}
          <p className="mt-3 font-mono text-xs uppercase tracking-wide text-[#5f6c63]">
            {post.source.reporter ? `Reporting by ${post.source.reporter}, ${post.source.label}. ` : null}
            {post.source.photoCredit ? `Photos courtesy of ${post.source.photoCredit}.` : null}
          </p>
        </div>
      ) : null}
    </PageShell>
  );
}
