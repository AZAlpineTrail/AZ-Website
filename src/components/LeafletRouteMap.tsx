"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";

import type { HomeTrailHighlight } from "@/lib/home";
import { routePreviewBounds, routePreviewPins, routePreviewSegments, routeSegmentSummaries } from "@/lib/route-preview-data";

export type TrailSegmentMapItem = {
  id: string;
  label: string;
  distanceMiles?: number | null;
  status: "published" | "in-development";
};

export type RouteDayStop = {
  day: string;
  route: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type LeafletRouteMapProps = {
  highlights?: HomeTrailHighlight[];
  activeHighlightId?: string;
  activeFlyTo?: boolean;
  openActivePopup?: boolean;
  onHighlightSelect?: (id: string) => void;
  segments?: TrailSegmentMapItem[];
  activeSegmentId?: string;
  onSegmentSelect?: (id: string) => void;
  dayStops?: RouteDayStop[];
};

function getHighlightId(highlight: HomeTrailHighlight, index: number) {
  return highlight._key || `${highlight.title}-${index}`;
}

const SEGMENT_HIT_WEIGHT = 20;
const SEGMENT_HIGHLIGHT_STYLE = { color: "#e11f3f", weight: 7, opacity: 1 } as const;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character] || character;
  });
}

function drawTrailOverlay(
  leaflet: typeof Leaflet,
  overlay: Leaflet.LayerGroup,
  highlights: HomeTrailHighlight[],
  markerRefs: Map<string, Leaflet.CircleMarker>,
  onHighlightSelect?: (id: string) => void,
  segments?: TrailSegmentMapItem[],
  segmentLayerRefs?: Map<string, Leaflet.Polyline>,
  onSegmentSelect?: (id: string) => void,
  highlightLayerRef?: { current: Leaflet.Polyline | null },
  dayStops?: RouteDayStop[],
) {
  overlay.clearLayers();
  markerRefs.clear();
  segmentLayerRefs?.clear();

  // One coherent trail line, always: the same legible three-layer style used everywhere
  // else on the site. Per-segment status (published/in development) is communicated in
  // the info panel below the map, not by giving each of the 28 lines its own color/dash.
  routePreviewSegments.forEach((segment) => {
    const positions = segment.map(([lat, lng]) => [lat, lng] as [number, number]);
    leaflet.polyline(positions, { color: "#13221a", weight: 9, opacity: 0.35, interactive: false }).addTo(overlay);
  });
  routePreviewSegments.forEach((segment) => {
    const positions = segment.map(([lat, lng]) => [lat, lng] as [number, number]);
    leaflet.polyline(positions, { color: "#b87939", weight: 5, opacity: 0.98, interactive: false }).addTo(overlay);
  });
  routePreviewSegments.forEach((segment) => {
    const positions = segment.map(([lat, lng]) => [lat, lng] as [number, number]);
    leaflet.polyline(positions, { color: "#fff2cf", weight: 1.5, opacity: 0.85, dashArray: "2 12", interactive: false }).addTo(overlay);
  });

  if (segments?.length) {
    // Wide, invisible hit targets per segment give a generous click/tap area without
    // needing to visually thicken or recolor the real line.
    segments.forEach((item) => {
      const index = routeSegmentSummaries.findIndex((summary) => summary.id === item.id);
      const line = index >= 0 ? routePreviewSegments[index] : undefined;
      if (!line) return;
      const positions = line.map(([lat, lng]) => [lat, lng] as [number, number]);

      const milesLabel = item.distanceMiles != null ? `${item.distanceMiles} mi` : "";
      const hit = leaflet
        .polyline(positions, { color: "#000000", weight: SEGMENT_HIT_WEIGHT, opacity: 0 })
        .bindTooltip(`<strong>${escapeHtml(item.label)}</strong>${milesLabel ? ` - ${escapeHtml(milesLabel)}` : ""}`, {
          sticky: true,
        })
        .addTo(overlay);

      if (onSegmentSelect) {
        hit.on("click", () => onSegmentSelect(item.id));
      }

      segmentLayerRefs?.set(item.id, hit);
    });

    if (highlightLayerRef) {
      highlightLayerRef.current = leaflet.polyline([], SEGMENT_HIGHLIGHT_STYLE).addTo(overlay);
    }
  } else {
    routePreviewPins.forEach((pin) => {
      leaflet
        .circleMarker([pin.lat, pin.lng], {
          radius: 6,
          color: "#173d2b",
          fillColor: "#fffdf7",
          fillOpacity: 1,
          weight: 2,
        })
        .bindPopup(`<strong>${escapeHtml(pin.label)}</strong>`)
        .addTo(overlay);
    });
  }

  highlights.forEach((highlight, index) => {
    if (!highlight.coordinates) return;
    const id = getHighlightId(highlight, index);
    const marker = leaflet
      .circleMarker([highlight.coordinates.lat, highlight.coordinates.lng], {
        radius: 9,
        color: "#fffdf7",
        fillColor: "#e11f3f",
        fillOpacity: 0.96,
        opacity: 1,
        weight: 3,
      })
      .bindPopup(
        `<strong>${escapeHtml(highlight.title)}</strong>${
          highlight.category ? `<br><span>${escapeHtml(highlight.category)}</span>` : ""
        }`,
      )
      .on("click", () => onHighlightSelect?.(id))
      .addTo(overlay);

    markerRefs.set(id, marker);
  });

  dayStops?.forEach((stop) => {
    const dayLabel = escapeHtml(stop.day.replace(/^0/, ""));
    const routeLabel = escapeHtml(stop.route);
    const icon = leaflet.divIcon({
      className: "rustys-day-marker-shell",
      html: `<span class="rustys-day-marker" style="display:grid;width:34px;height:34px;place-items:center;border:3px solid #fffdf7;border-radius:50%;background:#b74f32;box-shadow:0 2px 8px rgb(19 34 26 / 24%);color:#fffdf7;font-family:ui-monospace,monospace;font-size:12px;font-weight:900;line-height:1">${dayLabel}</span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    leaflet
      .marker([stop.coordinates.lat, stop.coordinates.lng], {
        icon,
        keyboard: true,
        title: `Day ${dayLabel}: ${stop.route}`,
      })
      .bindPopup(`<strong>Day ${dayLabel}</strong><br><span>${routeLabel}</span>`)
      .addTo(overlay);
  });
}

function updateHighlightMarkerStyles(markerRefs: Map<string, Leaflet.CircleMarker>, activeHighlightId?: string) {
  let activeMarker: Leaflet.CircleMarker | undefined;

  markerRefs.forEach((marker, id) => {
    const isActive = id === activeHighlightId;
    marker.setRadius(isActive ? 12 : 9);
    marker.setStyle({
      color: isActive ? "#13221a" : "#fffdf7",
      fillColor: "#e11f3f",
      fillOpacity: isActive ? 1 : 0.96,
      opacity: 1,
      weight: isActive ? 5 : 3,
    });
    if (isActive) activeMarker = marker;
  });

  activeMarker?.bringToFront();
}

function updateActiveSegmentHighlight(highlightLayer: Leaflet.Polyline | null, activeSegmentId?: string) {
  if (!highlightLayer) return;

  const index = activeSegmentId ? routeSegmentSummaries.findIndex((summary) => summary.id === activeSegmentId) : -1;
  const line = index >= 0 ? routePreviewSegments[index] : undefined;

  if (!line) {
    highlightLayer.setLatLngs([]);
    return;
  }

  highlightLayer.setLatLngs(line.map(([lat, lng]) => [lat, lng] as [number, number]));
  highlightLayer.bringToFront();
}

export function LeafletRouteMap({
  highlights = [],
  activeHighlightId,
  activeFlyTo = true,
  openActivePopup = true,
  onHighlightSelect,
  segments,
  activeSegmentId,
  onSegmentSelect,
  dayStops,
}: LeafletRouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const overlayRef = useRef<Leaflet.LayerGroup | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const markerRefs = useRef<Map<string, Leaflet.CircleMarker>>(new Map());
  const segmentLayerRefs = useRef<Map<string, Leaflet.Polyline>>(new Map());
  const highlightLayerRef = useRef<Leaflet.Polyline | null>(null);
  const hasFlownToSegmentRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    const markerMap = markerRefs.current;
    const segmentMap = segmentLayerRefs.current;

    async function mountMap() {
      if (!container || mapRef.current) return;
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

      const bounds = leaflet.latLngBounds(
        [routePreviewBounds.minLat, routePreviewBounds.minLng],
        [routePreviewBounds.maxLat, routePreviewBounds.maxLng],
      );
      // The container can still report a stale/zero size in the same tick as mount
      // (e.g. while a parent motion.div's layout is settling), which makes fitBounds
      // compute an absurdly deep zoom. Invalidate size on the next frame first.
      requestAnimationFrame(() => {
        map.invalidateSize({ animate: false });
        map.fitBounds(bounds, { padding: [36, 36], animate: false });
      });
      const overlay = leaflet.layerGroup().addTo(map);
      overlayRef.current = overlay;
      leafletRef.current = leaflet;
      mapRef.current = map;
      setReady(true);
    }

    mountMap();

    return () => {
      cancelled = true;
      overlayRef.current?.clearLayers();
      overlayRef.current = null;
      markerMap.clear();
      segmentMap.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || !leafletRef.current || !overlayRef.current) return;
    drawTrailOverlay(
      leafletRef.current,
      overlayRef.current,
      highlights,
      markerRefs.current,
      onHighlightSelect,
      segments,
      segmentLayerRefs.current,
      onSegmentSelect,
      highlightLayerRef,
      dayStops,
    );
    updateActiveSegmentHighlight(highlightLayerRef.current, activeSegmentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayStops, highlights, onHighlightSelect, onSegmentSelect, ready, segments]);

  useEffect(() => {
    if (!ready || !segments?.length) return;
    updateActiveSegmentHighlight(highlightLayerRef.current, activeSegmentId);

    // Skip the fly-in on first mount so the map opens on the whole trail for context;
    // every selection after that flies to the chosen segment, tying the list and map together.
    if (!hasFlownToSegmentRef.current) {
      hasFlownToSegmentRef.current = true;
      return;
    }

    const leaflet = leafletRef.current;
    const map = mapRef.current;
    if (!leaflet || !map || !activeSegmentId) return;
    const index = routeSegmentSummaries.findIndex((summary) => summary.id === activeSegmentId);
    const line = index >= 0 ? routePreviewSegments[index] : undefined;
    if (!line) return;

    const bounds = leaflet.latLngBounds(line.map(([lat, lng]) => [lat, lng] as [number, number]));
    map.flyToBounds(bounds, { padding: [48, 48], duration: 0.6 });
  }, [activeSegmentId, ready, segments]);

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

  useEffect(() => {
    if (!ready || !mapRef.current || !activeHighlightId) return;
    const activeMarker = markerRefs.current.get(activeHighlightId);
    if (!activeMarker) return;

    updateHighlightMarkerStyles(markerRefs.current, activeHighlightId);
    if (activeFlyTo) {
      const latLng = activeMarker.getLatLng();
      mapRef.current.flyTo(latLng, Math.max(mapRef.current.getZoom(), 9), { duration: 0.6 });
    }
    if (openActivePopup) {
      activeMarker.openPopup();
    }
  }, [activeFlyTo, activeHighlightId, openActivePopup, ready]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 h-full min-h-[430px] w-full sm:min-h-[520px] xl:min-h-[660px]" />
  );
}
