"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Layers, Mountain, Route } from "lucide-react";
import mapboxgl from "mapbox-gl";

import {
  routePreviewBounds,
  routePreviewSegments,
  routeSegmentSummaries,
  routeWaypoints,
} from "@/lib/route-preview-data";
import { trailSegmentIndex } from "@/lib/trail-segment-index";

const segmentByGpxId = new Map(trailSegmentIndex.map((entry) => [entry.gpxId, entry]));

type MapStatus = "loading" | "ready" | "missing-token" | "error";

const terrainSourceId = "mapbox-dem";
const routeSourceId = "azat-route";
const waypointSourceId = "azat-waypoints";
const routeLayerId = "azat-route-line";
const routeHaloLayerId = "azat-route-halo";
const routeHighlightLayerId = "azat-route-highlight";
const routeHitLayerId = "azat-route-hit-area";
const waypointCircleLayerId = "azat-waypoints-circle";
const waypointLabelLayerId = "azat-waypoints-label";
const emptySegmentFilter: mapboxgl.FilterSpecification = ["==", ["get", "id"], ""];

const routeGeoJson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
  type: "FeatureCollection",
  features: routePreviewSegments.map((segment, index) => ({
    type: "Feature",
    properties: {
      ...routeSegmentSummaries[index],
      segment: index + 1,
    },
    geometry: {
      type: "LineString",
      coordinates: segment.map(([lat, lng]) => [lng, lat]),
    },
  })),
};

const waypointGeoJson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: routeWaypoints.map((waypoint) => ({
    type: "Feature",
    properties: {
      label: waypoint.label,
      type: waypoint.type,
      elevationFeet: waypoint.eleMeters == null ? null : Math.round(waypoint.eleMeters * 3.28084),
    },
    geometry: {
      type: "Point",
      coordinates: [waypoint.lng, waypoint.lat],
    },
  })),
};

const fullBounds: mapboxgl.LngLatBoundsLike = [
  [routePreviewBounds.minLng, routePreviewBounds.minLat],
  [routePreviewBounds.maxLng, routePreviewBounds.maxLat],
];

type ScreenPoint = { x: number; y: number };
type NearestRouteSegment = {
  id: string;
  properties: (typeof routeSegmentSummaries)[number];
  distance: number;
};

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function segmentPopupHtml(properties: GeoJSON.GeoJsonProperties) {
  const elevation =
    properties?.minElevationFeet && properties?.maxElevationFeet
      ? `${Math.round(Number(properties.minElevationFeet)).toLocaleString()}-${Math.round(
          Number(properties.maxElevationFeet),
        ).toLocaleString()} ft`
      : "Elevation unavailable";

  // The GPX-derived name/id are the raw track name from the source file (typos and all) — the
  // segment index is the corrected, editorial name/slug, so prefer it when the id matches.
  const segment = segmentByGpxId.get(String(properties?.id ?? ""));
  const name = segment?.name ?? properties?.name;

  return `
    <div class="az-terrain-popup">
      <strong>${escapeHtml(name)}</strong>
      <span>${escapeHtml(properties?.distanceMiles)} mi · ${escapeHtml(elevation)}</span>
      ${segment ? `<a class="az-terrain-popup-link" href="/trail/${escapeHtml(segment.slug)}">View segment →</a>` : ""}
    </div>
  `;
}

function waypointPopupHtml(properties: GeoJSON.GeoJsonProperties) {
  const elevation = properties?.elevationFeet ? `${Number(properties.elevationFeet).toLocaleString()} ft` : "";

  return `
    <div class="az-terrain-popup">
      <strong>${escapeHtml(properties?.label)}</strong>
      <span>${escapeHtml(properties?.type)}</span>
      ${elevation ? `<small>${escapeHtml(elevation)}</small>` : ""}
    </div>
  `;
}

function distanceToScreenSegment(point: ScreenPoint, start: ScreenPoint, end: ScreenPoint) {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (segmentLengthSquared === 0) return Math.hypot(point.x - start.x, point.y - start.y);

  const t = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / segmentLengthSquared),
  );
  const projection = {
    x: start.x + t * segmentX,
    y: start.y + t * segmentY,
  };

  return Math.hypot(point.x - projection.x, point.y - projection.y);
}

function findNearestRouteSegment(map: mapboxgl.Map, point: ScreenPoint) {
  let nearest: NearestRouteSegment | null = null;

  for (let segmentIndex = 0; segmentIndex < routePreviewSegments.length; segmentIndex += 1) {
    const segment = routePreviewSegments[segmentIndex];
    const properties = routeSegmentSummaries[segmentIndex];
    if (!properties) continue;

    for (let index = 1; index < segment.length; index += 1) {
      const [startLat, startLng] = segment[index - 1];
      const [endLat, endLng] = segment[index];
      const start = map.project([startLng, startLat]);
      const end = map.project([endLng, endLat]);
      const distance = distanceToScreenSegment(point, start, end);

      if (!nearest || distance < nearest.distance) {
        nearest = { id: properties.id, properties, distance };
      }
    }
  }

  return nearest && nearest.distance <= 24 ? nearest : null;
}

function TerrainFallback({ status }: { status: MapStatus }) {
  const message =
    status === "missing-token"
      ? "Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to load the terrain view."
      : "Terrain view could not load.";

  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-[#08130d] px-5 text-center text-white">
      <div className="max-w-md rounded-[6px] border border-white/12 bg-white/8 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur">
        <Mountain className="mx-auto text-[#f1b65a]" size={30} aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold">3D trail view unavailable</h2>
        <p className="mt-3 text-sm leading-6 text-white/72">{message}</p>
      </div>
    </div>
  );
}

export type TrailTerrainMapProps = {
  embedded?: boolean;
  activeSegmentId?: string;
  onSegmentSelect?: (id: string) => void;
};

export function TrailTerrainMap({ embedded = false, activeSegmentId, onSegmentSelect }: TrailTerrainMapProps = {}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const activeSegmentIdRef = useRef("");
  const hasFlownToControlledSegmentRef = useRef(false);
  const onSegmentSelectRef = useRef(onSegmentSelect);
  const activeSegmentIdPropRef = useRef(activeSegmentId);
  useEffect(() => {
    onSegmentSelectRef.current = onSegmentSelect;
    activeSegmentIdPropRef.current = activeSegmentId;
  });
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [status, setStatus] = useState<MapStatus>(() => (token ? "loading" : "missing-token"));

  const fitRoute = useCallback(() => {
    mapRef.current?.fitBounds(fullBounds, {
      padding: { top: 120, right: 90, bottom: 120, left: 90 },
      pitch: 68,
      bearing: -28,
      duration: 1200,
      essential: true,
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!token) return;

    mapboxgl.accessToken = token;

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [-110.38, 34.12],
        zoom: 7.35,
        pitch: 68,
        bearing: -28,
        antialias: true,
        attributionControl: true,
        logoPosition: "bottom-right",
        projection: "mercator",
      });
    } catch {
      // Mapbox throws synchronously when WebGL is unavailable; show the fallback instead of crashing the page.
      queueMicrotask(() => setStatus("error"));
      return;
    }

    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "bottom-right",
    );

    map.on("load", () => {
      if (!map.getSource(terrainSourceId)) {
        map.addSource(terrainSourceId, {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
      }

      map.setTerrain({ source: terrainSourceId, exaggeration: 1.45 });
      map.setFog({
        color: "rgb(224, 214, 198)",
        "high-color": "rgb(149, 176, 192)",
        "horizon-blend": 0.16,
        "space-color": "rgb(8, 19, 13)",
        "star-intensity": 0,
      });

      map.addSource(routeSourceId, {
        type: "geojson",
        data: routeGeoJson,
      });

      map.addLayer({
        id: routeHaloLayerId,
        type: "line",
        source: routeSourceId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#fffdf7",
          "line-opacity": 0.92,
          "line-width": ["interpolate", ["linear"], ["zoom"], 5, 3.5, 10, 7, 13, 11],
        },
      });

      map.addLayer({
        id: routeLayerId,
        type: "line",
        source: routeSourceId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#76f0b0",
          "line-opacity": 0.98,
          "line-width": ["interpolate", ["linear"], ["zoom"], 5, 2, 10, 4.2, 13, 6.5],
        },
      });

      map.addLayer({
        id: routeHighlightLayerId,
        type: "line",
        source: routeSourceId,
        filter: emptySegmentFilter,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#f1b65a",
          "line-opacity": 0.98,
          "line-width": ["interpolate", ["linear"], ["zoom"], 5, 5, 10, 8, 13, 12],
        },
      });

      map.addLayer({
        id: routeHitLayerId,
        type: "line",
        source: routeSourceId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#ffffff",
          "line-opacity": 0.01,
          "line-width": ["interpolate", ["linear"], ["zoom"], 5, 18, 10, 28, 13, 38],
        },
      });

      map.addSource(waypointSourceId, {
        type: "geojson",
        data: waypointGeoJson,
      });

      map.addLayer({
        id: waypointCircleLayerId,
        type: "circle",
        source: waypointSourceId,
        minzoom: 8.15,
        paint: {
          "circle-color": "#f1b65a",
          "circle-opacity": ["interpolate", ["linear"], ["zoom"], 8.15, 0, 9, 0.95],
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 3, 12, 6],
          "circle-stroke-color": "#07150f",
          "circle-stroke-width": 1.5,
        },
      });

      map.addLayer({
        id: waypointLabelLayerId,
        type: "symbol",
        source: waypointSourceId,
        minzoom: 9.4,
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.05],
          "text-size": ["interpolate", ["linear"], ["zoom"], 9.4, 10, 12, 13],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#fffdf7",
          "text-halo-color": "#07150f",
          "text-halo-width": 1.5,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 9.4, 0, 10, 0.92],
        },
      });

      map.on("mousemove", (event) => {
        const nearest = findNearestRouteSegment(map, event.point);
        if (!nearest) {
          map.getCanvas().style.cursor = "";
          const controlledId = activeSegmentIdPropRef.current;
          activeSegmentIdRef.current = controlledId ?? "";
          map.setFilter(routeHighlightLayerId, controlledId ? ["==", ["get", "id"], controlledId] : emptySegmentFilter);
          return;
        }

        activeSegmentIdRef.current = nearest.id;
        map.getCanvas().style.cursor = "pointer";
        map.setFilter(routeHighlightLayerId, ["==", ["get", "id"], nearest.id]);
      });

      map.on("click", (event) => {
        const nearest = findNearestRouteSegment(map, event.point);
        if (!nearest) return;

        activeSegmentIdRef.current = nearest.id;
        map.setFilter(routeHighlightLayerId, ["==", ["get", "id"], nearest.id]);

        if (onSegmentSelectRef.current) {
          onSegmentSelectRef.current(nearest.id);
          return;
        }

        popupRef.current?.remove();
        popupRef.current = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, maxWidth: "260px" })
          .setLngLat(event.lngLat)
          .setHTML(segmentPopupHtml(nearest.properties))
          .addTo(map);
      });

      map.on("click", waypointCircleLayerId, (event) => {
        const feature = event.features?.[0];
        if (!feature?.properties) return;

        popupRef.current?.remove();
        popupRef.current = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, maxWidth: "240px" })
          .setLngLat(event.lngLat)
          .setHTML(waypointPopupHtml(feature.properties))
          .addTo(map);
      });

      map.on("mouseenter", waypointCircleLayerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", waypointCircleLayerId, () => {
        if (!activeSegmentIdRef.current) map.getCanvas().style.cursor = "";
      });

      const initialSegmentId = activeSegmentIdPropRef.current;
      const initialSummary = initialSegmentId
        ? routeSegmentSummaries.find((summary) => summary.id === initialSegmentId)
        : undefined;
      const initialIndex = initialSummary ? routeSegmentSummaries.indexOf(initialSummary) : -1;
      const initialLine = initialIndex >= 0 ? routePreviewSegments[initialIndex] : undefined;

      if (initialSegmentId && initialLine) {
        activeSegmentIdRef.current = initialSegmentId;
        map.setFilter(routeHighlightLayerId, ["==", ["get", "id"], initialSegmentId]);
        const bounds = initialLine.reduce(
          (acc, [lat, lng]) => acc.extend([lng, lat]),
          new mapboxgl.LngLatBounds(
            [initialLine[0][1], initialLine[0][0]],
            [initialLine[0][1], initialLine[0][0]],
          ),
        );
        map.fitBounds(bounds, { padding: 90, duration: 0, pitch: 68, bearing: -28 });
      } else {
        map.fitBounds(fullBounds, {
          padding: { top: 120, right: 80, bottom: 90, left: 80 },
          duration: 0,
          pitch: 68,
          bearing: -28,
        });
      }

      window.requestAnimationFrame(() => map.resize());
      setStatus("ready");
    });

    map.on("error", () => setStatus((current) => (current === "ready" ? current : "error")));

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
      popupRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;

    // The mount effect already set the initial highlight/camera for the segment active at
    // load time; this effect only reacts to later changes (e.g. the rider clicking a
    // different row in the hub's list), flying to whichever segment is now selected.
    if (!hasFlownToControlledSegmentRef.current) {
      hasFlownToControlledSegmentRef.current = true;
      return;
    }

    activeSegmentIdRef.current = activeSegmentId ?? "";

    if (!activeSegmentId) {
      map.setFilter(routeHighlightLayerId, emptySegmentFilter);
      return;
    }

    const index = routeSegmentSummaries.findIndex((summary) => summary.id === activeSegmentId);
    const line = index >= 0 ? routePreviewSegments[index] : undefined;
    if (!line) return;

    map.setFilter(routeHighlightLayerId, ["==", ["get", "id"], activeSegmentId]);
    const bounds = line.reduce(
      (acc, [lat, lng]) => acc.extend([lng, lat]),
      new mapboxgl.LngLatBounds([line[0][1], line[0][0]], [line[0][1], line[0][0]]),
    );
    map.fitBounds(bounds, { padding: 90, duration: 900, pitch: 68, bearing: -28, essential: true });
  }, [activeSegmentId, status]);

  return (
    <section
      className={
        embedded
          ? "absolute inset-0 overflow-hidden bg-[#08130d] text-white"
          : "relative h-[100svh] min-h-[680px] overflow-hidden bg-[#08130d] text-white"
      }
    >
      <div className="absolute inset-0 h-full w-full">
        <div ref={mapContainerRef} className="h-full w-full" aria-label="Arizona Alpine Trail 3D terrain map" />
      </div>

      {status === "missing-token" || status === "error" ? <TerrainFallback status={status} /> : null}

      {embedded ? null : (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-[#07150f]/48 via-[#07150f]/8 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-[#07150f]/44 via-[#07150f]/10 to-transparent" />
        </>
      )}

      <div
        className={`pointer-events-none relative z-[3] flex h-full flex-col justify-between px-4 pb-4 sm:px-6 ${
          embedded ? "pt-4" : "pt-24 lg:px-8"
        }`}
      >
        <div className="flex items-start justify-start">
          {embedded ? null : (
            <div className="pointer-events-auto rounded-[6px] border border-white/12 bg-[#07150f]/48 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-md sm:p-4">
              <h1 className="text-2xl font-semibold leading-none text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.44)] sm:text-4xl">
                AZAT 3D
              </h1>
              <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#76f0b0] sm:text-[10px]">
                GPX terrain preview
              </p>
            </div>
          )}
        </div>

        <div className={`flex items-end justify-start ${embedded ? "" : "mb-12 sm:mb-0"}`}>
          <div className="pointer-events-auto flex gap-2">
            <button type="button" onClick={fitRoute} className="az-terrain-control">
              <Route size={16} aria-hidden="true" />
              Full route
            </button>
          </div>
        </div>
      </div>

      {status === "loading" ? (
        <div className="absolute inset-0 z-[4] grid place-items-center bg-[#07150f] text-white">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/8 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-white/78">
            <Layers size={16} className="text-[#f1b65a]" aria-hidden="true" />
            Loading terrain
          </div>
        </div>
      ) : null}
    </section>
  );
}
