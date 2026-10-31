import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import styles from "./NewsPreview.module.css";
import { formatNewsDate, type NewsPost } from "@/lib/news";

type NewsPreviewProps = {
  title?: string;
  posts?: NewsPost[];
};

export function NewsPreview({ title = "Latest News", posts = [] }: NewsPreviewProps) {
  if (!posts.length) return null;

  return (
    <section id="news" aria-labelledby="home-news-title" className={styles.section}>
      <div className={styles.inner}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="home-news-title" className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
          <Link
            href="/news"
            className={styles.allPosts}
          >
            View all posts
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.stories}>
          {posts.slice(0, 3).map((post, index) => (
            <Link key={post.slug} href={`/news/${post.slug}`} className={`${styles.story} ${index === 0 ? styles.featured : ""}`}>
              <div className={`${styles.image} ${post.heroImageContain ? styles.contain : ""}`}>
                {post.heroImage ? <Image
                  src={post.heroImage}
                  alt={post.heroImageAlt || post.title}
                  fill
                  sizes={index === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 180px, 112px"}
                  className={post.heroImageContain ? "object-contain" : "object-cover"}
                /> : null}
              </div>
              <div className={styles.copy}>
                <p className={styles.date}>{formatNewsDate(post.date)}</p>
                <h3>{post.title}</h3>
                {index === 0 && post.excerpt ? <p className={styles.excerpt}>{post.excerpt}</p> : null}
                <span className={styles.read}>Read article <ArrowRight size={14} aria-hidden="true" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
