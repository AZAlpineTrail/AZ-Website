import type { NextConfig } from "next";

const routeRedirects = [
  { source: "/the-trail", destination: "/trail" },
  { source: "/the-trail-2", destination: "/trail" },
  { source: "/a-route", destination: "/trail" },
  { source: "/b-route", destination: "/trail" },
  { source: "/example-gpx-view", destination: "/trail" },
  { source: "/example-esri-view", destination: "/trail" },
  { source: "/plan-your-trail", destination: "/trail" },
  { source: "/rye-creek", destination: "/trail/rye-creek" },
  { source: "/a01", destination: "/trail/rye-creek" },
  { source: "/a02", destination: "/trail/tonto-basin" },
  { source: "/a03", destination: "/trail/juniper-canyon" },
  { source: "/a04", destination: "/trail/cherry-creek" },
  { source: "/a05", destination: "/trail/canyon-point" },
  { source: "/a06", destination: "/trail/legacy-ranch" },
  { source: "/a07", destination: "/trail/deer-springs-lookout" },
  { source: "/a08", destination: "/trail/border-line" },
  { source: "/a09", destination: "/trail/porter-mountain" },
  { source: "/a10", destination: "/trail/greens-peak" },
  { source: "/a11", destination: "/trail/little-colorado-river" },
  { source: "/a12", destination: "/trail/black-river" },
  { source: "/a13", destination: "/trail/hannagan" },
  { source: "/b01", destination: "/trail/balke-cabin" },
  { source: "/b02", destination: "/trail/johns-canyon" },
  { source: "/b03", destination: "/trail/mamie-creek" },
  { source: "/b04", destination: "/trail/milligan-valley" },
  { source: "/b05", destination: "/trail/south-fork" },
  { source: "/b06", destination: "/trail" },
  { source: "/b07", destination: "/trail/carnero-lake" },
  { source: "/b08", destination: "/trail/land-of-the-pioneers" },
  { source: "/b09", destination: "/trail" },
  { source: "/b10", destination: "/trail/lone-pine-dam" },
  { source: "/b11", destination: "/trail/maverick-west" },
  { source: "/b12", destination: "/trail/many-draws" },
  { source: "/b13", destination: "/trail/chevelon-crossing" },
  { source: "/b14", destination: "/trail/canyon-lands" },
  { source: "/b15", destination: "/trail/view-after-view" },
  { source: "/b16", destination: "/trail/the-rim" },
  { source: "/b17", destination: "/trail/doll-baby" },
];

const townRedirects = [
  { source: "/towns", destination: "/trail" },
  { source: "/towns/:slug", destination: "/trail" },
  { source: "/alpine", destination: "/trail" },
  { source: "/greer", destination: "/trail" },
  { source: "/show-low", destination: "/trail" },
  { source: "/pine", destination: "/trail" },
  { source: "/payson-az", destination: "/trail" },
  { source: "/payson", destination: "/trail" },
  { source: "/jakes-corner", destination: "/trail" },
  { source: "/forest-lakes", destination: "/trail" },
  { source: "/heber-overgaard", destination: "/trail" },
  { source: "/eagar", destination: "/trail" },
  { source: "/hannagan-meadow", destination: "/trail" },
  { source: "/pinetop-lakeside", destination: "/trail" },
  { source: "/young", destination: "/trail" },
  { source: "/punkin-center", destination: "/trail" },
  { source: "/taylor-snowflake", destination: "/trail" },
  { source: "/pinedale", destination: "/trail" },
  { source: "/strawberry", destination: "/trail" },
  { source: "/winslow", destination: "/trail" },
  { source: "/holbrook", destination: "/trail" },
];

const commerceRedirects = [
  { source: "/checkout", destination: "/cart" },
  { source: "/product-category/uncategorized", destination: "/shop" },
  { source: "/product-category/clothing", destination: "/shop" },
  { source: "/product-category/housewares", destination: "/shop" },
  { source: "/product/:slug", destination: "/shop" },
];

const newsRedirects = [
  { source: "/a-word-from-our-president", destination: "/news/a-word-from-our-president" },
  { source: "/kick-off-meeting-with-logan-simpson", destination: "/news/kick-off-meeting-with-logan-simpson" },
  { source: "/donation-from-waste-management-of-arizona", destination: "/news/donation-from-waste-management-of-arizona" },
  { source: "/alpine-open-house-meeting", destination: "/news/alpine-open-house-meeting" },
  { source: "/outdoors-sw-magazine-article-july-2023", destination: "/news/outdoors-sw-magazine-article-july-2023" },
  { source: "/azat-goals-and-objectives-workshop", destination: "/news/azat-goals-and-objectives-workshop" },
  { source: "/az-game-fish-outdoor-expo", destination: "/news/az-game-fish-outdoor-expo" },
  { source: "/category/:slug", destination: "/news" },
  { source: "/author/azalpinetrailit", destination: "/news" },
];

const utilityRedirects = [
  { source: "/home", destination: "/" },
  { source: "/sample-page", destination: "/" },
  { source: "/pardon-our-dust", destination: "/" },
  { source: "/about-us", destination: "/about" },
  { source: "/our-mission", destination: "/about" },
  { source: "/economic-benefits", destination: "/about" },
  { source: "/contact-us", destination: "/contact" },
  { source: "/frequently-asked-questions", destination: "/faq" },
  { source: "/privacy-policy", destination: "/privacy" },
  { source: "/national-forests", destination: "/resources" },
  { source: "/ohv-safety", destination: "/resources" },
  { source: "/off-highway-vehicle-ohv-information", destination: "/resources" },
  { source: "/protected-download/2113", destination: "/downloads/arizona-alpine-trail-gpx" },
  { source: "/protected-download/2127", destination: "/downloads/azat-shapefile" },
  { source: "/protected-download/2248", destination: "/downloads/azat-segments-v5-kml" },
  { source: "/log-in", destination: "/login" },
  { source: "/user-registration", destination: "/sign-up" },
  { source: "/user-profile", destination: "/account" },
  { source: "/my-account", destination: "/account" },
  { source: "/sorry-we-are-not-accepting-users-yet", destination: "/sign-up" },
  {
    source: "/wp-content/uploads/2025/03/AZAT-Map-10-19-2024-Revised-with-Logo-optimized.pdf",
    destination: "/trail",
  },
  {
    source: "/wp-content/uploads/2023/08/2023-08-28_alpine_open_house.pdf",
    destination: "/news/alpine-open-house-meeting",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "azalpinetrail.org",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      ...routeRedirects,
      ...townRedirects,
      ...commerceRedirects,
      ...newsRedirects,
      ...utilityRedirects,
    ].map((redirect) => ({ ...redirect, permanent: true }));
  },
};

export default nextConfig;
