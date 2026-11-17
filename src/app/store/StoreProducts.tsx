"use client";

import { useState } from "react";
import Image from "next/image";
import { products } from "./products";
import styles from "./store.module.css";

type Product = (typeof products)[number];

export function StoreProducts() {
  return (
    <ul className={styles.grid}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index === 0} />
      ))}
    </ul>
  );
}

function ProductCard({ product, priority }: { product: Product; priority: boolean }) {
  const [side, setSide] = useState<"front" | "back">("front");
  const other = side === "front" ? "back" : "front";

  return (
    <li className={styles.card}>
      <div className={styles.media}>
        <a
          href={product.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${product.name}, ${product.price}, on Bonfire (opens in a new tab)`}
        >
          <Image
            src={`/azat/shop/${product.id}-${side}.jpg`}
            alt=""
            width={900}
            height={900}
            sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 300px"
            preload={priority}
          />
        </a>
        <button
          type="button"
          className={styles.thumb}
          onClick={() => setSide(other)}
          aria-label={`Show ${other} of ${product.name}`}
        >
          <Image src={`/azat/shop/${product.id}-${other}.jpg`} alt="" width={120} height={120} />
        </button>
      </div>
      <a className={styles.name} href={product.href} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
        {product.name}
      </a>
      <p className={styles.price}>{product.price} USD</p>
      <ul className={styles.swatches} aria-label={`Colors: ${product.colors.map((c) => c.name).join(", ")}`}>
        {product.colors.map((color) => (
          <li key={color.name} title={color.name} style={{ backgroundColor: color.hex }} />
        ))}
      </ul>
    </li>
  );
}
