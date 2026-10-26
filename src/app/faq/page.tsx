import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { FaqExplorer } from "@/components/FaqExplorer";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common Arizona Alpine Trail questions about OHV access, maps, GPX downloads, safety, trip planning, permits, and trail stewardship.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Arizona Alpine Trail FAQ",
    description:
      "Common questions about OHV access, maps, GPX downloads, safety, trip planning, permits, and stewardship.",
    url: "/faq",
  },
};

export default function FAQPage() {
  return (
    <PageShell title="FAQ">
      <FaqExplorer />
    </PageShell>
  );
}
