import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StoreProducts } from "./StoreProducts";
import { BONFIRE_STORE_URL } from "./products";
import styles from "./store.module.css";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Official Arizona Alpine Trail merchandise. Every purchase supports responsible OHV recreation and trail stewardship in Arizona’s high country.",
  alternates: { canonical: "/store" },
  openGraph: {
    title: "Arizona Alpine Trail Store",
    description:
      "Official Arizona Alpine Trail merchandise, printed and shipped by Bonfire.",
    url: "/store",
  },
};

export default function StorePage() {
  return (
    <>
      <Header />
      <main
        id="main"
        className="mx-auto w-full max-w-7xl flex-1 px-5 pb-20 pt-36 sm:px-8"
      >
        <div className={styles.body}>
          <aside className={styles.about} aria-labelledby="store-title">
            <Image
              src="/azat/brand/azat-logo.png"
              alt=""
              width={300}
              height={340}
              className={styles.logo}
              preload
            />
            <h1 id="store-title" className={styles.storeName}>
              Arizona Alpine Trail
            </h1>
            <p className={styles.storeType}>Official Merchandise</p>
            <p className={styles.storeAbout}>
              Show your support for Arizona Alpine Trail with official AZAT gear.
              Every purchase supports responsible OHV recreation and trail
              stewardship in Arizona’s high country.
            </p>
            <a
              className={styles.primary}
              href={BONFIRE_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop on Bonfire <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </aside>

          <section
            className={styles.collection}
            aria-labelledby="collection-title"
          >
            <h2 id="collection-title">Arizona Alpine Trail Performance Tee</h2>
            <StoreProducts />
          </section>
        </div>

        <a
          className={styles.cta}
          href={BONFIRE_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the full store on Bonfire{" "}
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </main>
      <Footer />
    </>
  );
}
