import Image from "next/image";

// Layered spruce forest for the scroll hero. Grey back rows were mapped to partial
// alpha, so they read as fog over the photo; the asset ends in solid ground so the
// layer can rise without exposing its bottom edge.
export function TrailSilhouette() {
  return (
    <Image
      src="/azat/images/hero-forest-fog.webp"
      alt=""
      fill
      sizes="104vw"
      className="az-trail-silhouette"
    />
  );
}
