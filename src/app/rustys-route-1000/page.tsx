import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RustysRouteExperience } from "@/components/RustysRouteExperience";
import { getRustysRoutePageData } from "@/lib/rustys-route";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRustysRoutePageData();

  return {
    title: page.seo?.title || page.title || "Rusty 1000",
    description: page.seo?.description || "An 11-day hotel-based ride around the Arizona Alpine Trail.",
  };
}

export default async function RustysRoutePage() {
  const page = await getRustysRoutePageData();

  return (
    <>
      <Header />
      <RustysRouteExperience data={page} />
      <Footer />
    </>
  );
}
