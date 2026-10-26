import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { TrailTerrainMap } from "@/components/TrailTerrainMap";

export const metadata: Metadata = {
  title: "3D Trail View",
  description: "Explore the Arizona Alpine Trail route in a 3D terrain view.",
  alternates: { canonical: "/trail/3d" },
  openGraph: {
    title: "3D Arizona Alpine Trail View",
    description: "Explore the Arizona Alpine Trail route in a 3D terrain view.",
    url: "/trail/3d",
  },
};

export default function Trail3DPage() {
  return (
    <>
      <Header homeOverlay />
      <main id="main">
        <TrailTerrainMap />
      </main>
    </>
  );
}
