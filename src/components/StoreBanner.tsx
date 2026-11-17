import Image from "next/image";
import Link from "next/link";

export function StoreBanner() {
  return (
    <Link
      href="/store"
      className="group block bg-[#173d2b] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#f1b65a]"
    >
      <Image
        src="/azat/shop/store-banner.webp"
        alt="Take the trail with you. AZAT performance tees and hoodie, available now in the AZAT Store."
        width={3840}
        height={960}
        sizes="100vw"
        quality={90}
        className="block h-auto w-full transition-opacity duration-200 group-hover:opacity-90 motion-reduce:transition-none"
      />
    </Link>
  );
}
