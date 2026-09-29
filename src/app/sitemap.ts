import type { MetadataRoute } from "next";
import { getNewsPosts } from "@/lib/news";
import { trailSegmentIndex } from "@/lib/trail-segment-index";

const siteUrl = "https://azalpinetrail.org";

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/downloads",
  "/faq",
  "/news",
  "/resources",
  "/rustys-route-1000",
  "/shop",
  "/trail",
  "/trail/3d",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const newsPosts = await getNewsPosts();
  const routes = [
    ...staticRoutes,
    ...trailSegmentIndex.map((segment) => `/trail/${segment.slug}`),
    ...newsPosts.map((post) => `/news/${post.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route.startsWith("/news") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/trail" ? 0.9 : 0.7,
  }));
}
