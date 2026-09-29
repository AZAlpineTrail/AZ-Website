import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/api/",
        "/auth/",
        "/cart",
        "/downloads/*/thanks",
        "/forgot-password",
        "/login",
        "/sign-in",
        "/sign-up",
        "/studio",
        "/update-password",
      ],
    },
    sitemap: "https://azalpinetrail.org/sitemap.xml",
  };
}
