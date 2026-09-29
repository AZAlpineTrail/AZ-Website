import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ItineraryFeature } from "@/components/ItineraryFeature";
import { MissionStatement } from "@/components/MissionStatement";
import { NewsPreview } from "@/components/NewsPreview";
import { ScrollHero } from "@/components/ScrollHero";
import { TrailMap } from "@/components/TrailMap";
import { getHomePageData } from "@/lib/home";
import { getNewsPosts } from "@/lib/news";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Arizona Alpine Trail",
  description:
    "Explore the Arizona Alpine Trail with official maps, 28 segment guides, protected GPX downloads, safety resources, and trail news.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Arizona Alpine Trail",
    description:
      "Official maps, 28 segment guides, protected GPX downloads, safety resources, and trail news.",
    url: "/",
  },
};

export default async function Home() {
  const [homePage, newsPosts] = await Promise.all([getHomePageData(), getNewsPosts()]);
  const downloads = (homePage.downloads || [])
    .filter((download) => download.href !== "/downloads/azat-shapefile")
    .slice(0, 3);

  return (
    <>
      <Header />
      <main id="main" className="overflow-hidden bg-[#07150f] text-white">
        <ScrollHero
          title={homePage.heroTitle}
          copy={homePage.heroCopy}
          image={homePage.heroImage}
          imageAlt={homePage.heroImageAlt}
          secondaryCta={homePage.secondaryCta}
        />

        <TrailMap
          title={homePage.mapTitle}
          copy={homePage.mapCopy}
          downloads={downloads}
        />

        <MissionStatement
          statement={homePage.missionStatement}
          attribution={homePage.missionAttribution}
          image={homePage.missionImage}
          imageAlt={homePage.missionImageAlt}
        />

        <ItineraryFeature
          title={homePage.itineraryTitle}
          image={homePage.itineraryImage}
          imageAlt={homePage.itineraryImageAlt}
          href={homePage.itineraryHref}
          cards={homePage.itineraryCards}
        />

        <NewsPreview title={homePage.featuredNewsTitle} posts={newsPosts} />
      </main>
      <Footer />
    </>
  );
}
