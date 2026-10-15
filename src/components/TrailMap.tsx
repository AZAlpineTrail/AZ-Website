import Image from "next/image";
import Link from "next/link";
import { Download, Mountain } from "lucide-react";

import { TrailLoop } from "@/components/TrailLoop";

export function TrailMap() {
  return (
    <section id="trail-map" className="az-map-experience relative isolate overflow-hidden bg-[#f4f1e8] text-[#13221a]">
      <div className="mx-auto max-w-[1540px] px-3 py-3 sm:px-5 lg:px-8 xl:py-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-stretch">
          <div className="relative min-h-[430px] overflow-hidden rounded-[6px] border border-[#cfd7cb] bg-[#dfeecf] shadow-[0_32px_80px_rgba(19,34,26,0.18)] sm:min-h-[520px] xl:min-h-[760px]">
            <Image
              src="/azat/images/home-trail-segment-map.jpg"
              alt="Arizona Alpine Trail map showing the Historic Route 66, Rim Country, Deuce of Clubs, Heart of the Trail, Wild West, and Bear Wallow segments"
              fill
              sizes="(min-width: 1280px) calc(100vw - 480px), 100vw"
              className="object-contain"
            />

            <div className="absolute left-16 top-3 z-10 sm:left-auto sm:right-3">
              <Link
                href="/trail/3d"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e5b96f] bg-[#173d2b] px-4 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_28px_rgba(19,34,26,0.28)] transition hover:bg-[#e5b96f] hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5b96f]"
              >
                <Mountain size={14} aria-hidden="true" />
                View in 3D
              </Link>
            </div>

            <div id="downloads" className="absolute bottom-3 left-3 z-10">
              <Link
                href="/trail"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d8ded4] bg-[#fffdf7]/94 px-3.5 text-xs font-black uppercase tracking-[0.1em] text-[#173d2b] shadow-[0_10px_28px_rgba(19,34,26,0.16)] backdrop-blur transition hover:border-[#b74f32] hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
              >
                <Download size={14} aria-hidden="true" />
                Download
              </Link>
            </div>
          </div>

          <div className="relative z-20 xl:flex xl:min-h-[760px]">
            <TrailLoop />
          </div>
        </div>
      </div>
    </section>
  );
}
