"use client";

import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Card, CardBody } from "@sovoli/ui/components/card";

import { env } from "~/env";
import { pluralize } from "~/utils/pluralize";

import type { ProjectDirectoryEntry } from "../types";

interface MapViewProps {
  projects: ProjectDirectoryEntry[];
}

const DEFAULT_CENTER = { lat: 18.0, lng: -77.5 };

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface ProjectMarker {
  key: string;
  projectTitle: string;
  orgName: string;
  coordinates?: LatLngLiteral;
  placeId?: string;
  address?: string;
  priority?: ProjectDirectoryEntry["priority"];
}

interface GeocodingLibrary {
  Geocoder: new () => {
    geocode: (
      request: google.maps.GeocoderRequest,
      callback: (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus,
      ) => void,
    ) => void;
  };
}

export function MapView({ projects }: MapViewProps) {
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card>
        <CardBody>
          <p className="text-gray-600">
            Map view is unavailable until the{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs text-gray-800">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{" "}
            environment variable is configured.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["geocoding"]}>
      <ProjectsMap projects={projects} />
    </APIProvider>
  );
}

function ProjectsMap({ projects }: MapViewProps) {
  const geocodingLib = useMapsLibrary("geocoding") as GeocodingLibrary | null;

  const markers = useMemo<ProjectMarker[]>(() => {
    return projects
      .map((project) => ({
        key: project.id,
        projectTitle: project.title,
        orgName: project.orgName,
        coordinates: project.coordinates,
        placeId: project.placeId,
        address: project.locationAddress,
        priority: project.priority,
      }))
      .filter((marker) =>
        Boolean(marker.coordinates ?? marker.placeId ?? marker.address),
      );
  }, [projects]);

  const [geocodedPositions, setGeocodedPositions] = useState<
    Record<string, LatLngLiteral>
  >({});

  useEffect(() => {
    if (!geocodingLib) return;

    const unresolved = markers.filter(
      (marker) =>
        !marker.coordinates &&
        !geocodedPositions[marker.key] &&
        Boolean(marker.placeId ?? marker.address),
    );

    if (unresolved.length === 0) return;

    let cancelled = false;
    const geocoder = new geocodingLib.Geocoder();

    const geocode = async () => {
      const updates: Record<string, LatLngLiteral> = {};

      await Promise.all(
        unresolved.map(
          (marker) =>
            new Promise<void>((resolve) => {
              const request: google.maps.GeocoderRequest | null = marker.placeId
                ? { placeId: marker.placeId }
                : marker.address
                  ? { address: marker.address }
                  : null;

              if (!request) {
                resolve();
                return;
              }

              geocoder.geocode(request, (results, status) => {
                if (cancelled) {
                  resolve();
                  return;
                }

                if (
                  status !== google.maps.GeocoderStatus.OK ||
                  !Array.isArray(results) ||
                  results.length === 0
                ) {
                  resolve();
                  return;
                }

                const firstResult = results[0];
                if (!firstResult) {
                  resolve();
                  return;
                }

                const geometry = firstResult.geometry;
                const location = geometry.location;
                updates[marker.key] = {
                  lat: location.lat(),
                  lng: location.lng(),
                };
                resolve();
              });
            }),
        ),
      );

      if (!cancelled && Object.keys(updates).length > 0) {
        setGeocodedPositions((prev) => ({ ...prev, ...updates }));
      }
    };

    void geocode();

    return () => {
      cancelled = true;
    };
  }, [geocodingLib, geocodedPositions, markers]);

  const resolvedMarkers = useMemo(
    () =>
      markers.map((marker) => ({
        ...marker,
        position: marker.coordinates ?? geocodedPositions[marker.key],
      })),
    [geocodedPositions, markers],
  );

  const markerPositions = useMemo(() => {
    return resolvedMarkers
      .map((marker) => marker.position)
      .filter(Boolean) as LatLngLiteral[];
  }, [resolvedMarkers]);

  if (markerPositions.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-gray-600">
            We don&apos;t have precise coordinates for these projects yet.
            Switch back to the list view while we finalize map coverage.
          </p>
        </CardBody>
      </Card>
    );
  }

  const defaultCenter = markerPositions[0] ?? DEFAULT_CENTER;
  const defaultZoom = markerPositions.length > 1 ? 10 : 13;

  return (
    <div>
      <div className="h-[360px] w-full overflow-hidden rounded-xl border border-gray-200 sm:h-[480px] lg:h-[600px]">
        <Map
          id="projects-map"
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          zoomControl
          className="h-full w-full"
        >
          <FitBounds positions={markerPositions} />
          {resolvedMarkers.map((marker) => {
            if (!marker.position) return null;
            return (
              <Marker
                key={marker.key}
                position={marker.position}
                title={`${marker.projectTitle} • ${marker.orgName}`}
                icon={getMarkerIcon(marker.priority)}
              />
            );
          })}
        </Map>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Showing {pluralize(markerPositions.length, "project location")} across
        the Sovoli network.
      </p>
    </div>
  );
}

function FitBounds({ positions }: { positions: LatLngLiteral[] }) {
  const map = useMap("projects-map");

  useEffect(() => {
    if (!map || positions.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    positions.forEach((position) => bounds.extend(position));

    map.fitBounds(bounds, 48);
  }, [map, positions]);

  return null;
}

type PriorityLevel = Exclude<
  ProjectDirectoryEntry["priority"],
  undefined | null
>;

interface GoogleNamespaceLike {
  maps?: {
    Size: typeof google.maps.Size;
    Point: typeof google.maps.Point;
  };
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "#dc2626", // red-600
  emergency: "#b91c1c", // red-700
  high: "#f97316", // orange-500
  medium: "#f59e0b", // amber-500
  low: "#0ea5e9", // sky-500
};

function getPriorityColor(priority?: PriorityLevel) {
  if (!priority) return "#2563eb"; // blue-600 fallback
  const normalized = priority.toLowerCase();
  return PRIORITY_COLORS[normalized] ?? "#2563eb";
}

function getMarkerIcon(priority?: PriorityLevel): google.maps.Icon | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const googleGlobal = (
    globalThis as typeof globalThis & { google?: GoogleNamespaceLike }
  ).google;

  if (typeof googleGlobal === "undefined") {
    return undefined;
  }

  const mapsNamespace = googleGlobal.maps;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!mapsNamespace) {
    return undefined;
  }

  const sizeCtor = mapsNamespace.Size;
  const pointCtor = mapsNamespace.Point;

  if (typeof sizeCtor !== "function" || typeof pointCtor !== "function") {
    return undefined;
  }

  const color = getPriorityColor(priority);
  const svg = encodeURIComponent(
    `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="10" fill="${color}" />
      <circle cx="16" cy="16" r="12" fill="none" stroke="#ffffff" stroke-width="2" />
    </svg>`,
  );

  const scaledSize = new sizeCtor(30, 30);
  const anchor = new pointCtor(15, 15);

  return {
    url: `data:image/svg+xml;charset=UTF-8,${svg}`,
    scaledSize,
    anchor,
  };
}
