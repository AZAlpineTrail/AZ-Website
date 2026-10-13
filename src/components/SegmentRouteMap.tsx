"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";

import { routeSegmentDetailPoints } from "@/lib/route-preview-data";

export type SegmentRouteMapProps = {
  segmentId: string;
  label: string;
};

export function SegmentRouteMap({ segmentId, label }: SegmentRouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    async function mountMap() {
      if (!container || mapRef.current) return;
      const points = routeSegmentDetailPoints[segmentId];
      if (!points?.length) return;

      const leaflet = await import("leaflet");
      if (cancelled || !container) return;

      const map = leaflet.map(container, {
        attributionControl: true,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      leaflet.control.zoom({ position: "topright" }).addTo(map);
      const controlCorner = container.querySelector<HTMLElement>(".leaflet-top.leaflet-right");
      if (controlCorner) {
        controlCorner.style.top = "50%";
        controlCorner.style.transform = "translateY(-50%)";
      }

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

      const positions = points.map(([lat, lng]) => [lat, lng] as [number, number]);
      leaflet.polyline(positions, { color: "#13221a", weight: 9, opacity: 0.3 }).addTo(map);
      leaflet.polyline(positions, { color: "#b87939", weight: 5, opacity: 0.98 }).addTo(map);
      leaflet.polyline(positions, { color: "#fff2cf", weight: 1.5, opacity: 0.85, dashArray: "2 12" }).addTo(map);

      const start = positions[0];
      const end = positions.at(-1);
      if (start) {
        leaflet
          .circleMarker(start, { radius: 7, color: "#173d2b", fillColor: "#f1b65a", fillOpacity: 1, weight: 2 })
          .bindPopup(`<strong>${label}</strong><br>Start`)
          .addTo(map);
      }
      if (end) {
        leaflet
          .circleMarker(end, { radius: 7, color: "#173d2b", fillColor: "#fffdf7", fillOpacity: 1, weight: 2 })
          .bindPopup(`<strong>${label}</strong><br>End`)
          .addTo(map);
      }

      const bounds = leaflet.latLngBounds(positions);
      requestAnimationFrame(() => {
        map.invalidateSize({ animate: false });
        map.fitBounds(bounds, { padding: [32, 32], animate: false });
      });
      mapRef.current = map;
      setReady(true);
    }

    mountMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      if (container) container.innerHTML = "";
    };
  }, [label, segmentId]);

  useEffect(() => {
    if (!ready || !mapRef.current || !containerRef.current) return;
    const map = mapRef.current;
    const container = containerRef.current;
    const invalidateMapSize = () => map.invalidateSize({ animate: false });

    invalidateMapSize();
    const resizeObserver = new ResizeObserver(invalidateMapSize);
    resizeObserver.observe(container);
    window.addEventListener("resize", invalidateMapSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", invalidateMapSize);
    };
  }, [ready]);

  return <div ref={containerRef} className="az-map-experience absolute inset-0 z-0 h-full min-h-[320px] w-full" />;
}
