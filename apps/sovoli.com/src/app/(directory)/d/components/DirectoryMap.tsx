"use client";

import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import { env } from "~/env";
import type { Address, OrgInstance } from "~/modules/organisations/types";
import { pluralize } from "~/utils/pluralize";

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface DirectoryMarker {
  key: string;
  title: string;
  coordinates?: LatLngLiteral;
  placeId?: string;
  address?: string;
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

export interface DirectoryMapProps {
  orgs: OrgInstance[];
  readableCategory: string;
  formattedLocations: string;
}

const DEFAULT_CENTER: LatLngLiteral = { lat: 0, lng: 0 };

function formatAddress(address: Address | undefined): string | undefined {
  if (!address) return undefined;

  const parts = [
    address.line1,
    address.line2,
    address.line3,
    address.city,
    address.state,
    address.postalCode,
    address.countryCode,
  ].filter(Boolean);

  if (parts.length === 0) {
    return undefined;
  }

  return parts.join(", ");
}

export function DirectoryMap({
  orgs,
  readableCategory,
  formattedLocations,
}: DirectoryMapProps) {
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card>
        <CardBody>
          <p className="text-default-600">
            Map view is currently unavailable. Please configure{" "}
            <code className="rounded bg-default-100 px-1 py-0.5 text-xs">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{" "}
            to enable Google Maps.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["geocoding"]}>
      <DirectoryMapContent
        orgs={orgs}
        readableCategory={readableCategory}
        formattedLocations={formattedLocations}
      />
    </APIProvider>
  );
}

function DirectoryMapContent({
  orgs,
  readableCategory,
  formattedLocations,
}: DirectoryMapProps) {
  const geocodingLib = useMapsLibrary("geocoding") as GeocodingLibrary | null;

  const markers = useMemo<DirectoryMarker[]>(() => {
    const entries: DirectoryMarker[] = [];

    for (const orgInstance of orgs) {
      const { org } = orgInstance;
      for (const location of org.locations) {
        const hasCoordinates = Boolean(location.coordinates);
        const hasPlaceId = Boolean(location.placeId);
        const formattedAddress = formatAddress(location.address);
        const hasAddress = Boolean(formattedAddress);
        if (!hasCoordinates && !hasPlaceId && !hasAddress) continue;

        entries.push({
          key: org.username,
          title: org.name,
          coordinates: location.coordinates
            ? {
                lat: location.coordinates.lat,
                lng: location.coordinates.lng,
              }
            : undefined,
          placeId: location.placeId ?? undefined,
          address: formattedAddress,
        });
      }
    }
    return entries;
  }, [orgs]);

  const [geocodedPositions, setGeocodedPositions] = useState<
    Record<string, LatLngLiteral>
  >({});

  const resolvedMarkers = useMemo(
    () =>
      markers.map((marker) => ({
        ...marker,
        position: marker.coordinates ?? geocodedPositions[marker.key],
      })),
    [geocodedPositions, markers],
  );

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
                  !results ||
                  results.length === 0
                ) {
                  resolve();
                  return;
                }

                const [firstResult] = results;
                if (!firstResult) {
                  resolve();
                  return;
                }

                const location = firstResult.geometry.location;

                updates[marker.key] = {
                  lat: location.lat(),
                  lng: location.lng(),
                };
                resolve();
              });
            }),
        ),
      );

      if (cancelled || Object.keys(updates).length === 0) {
        return;
      }

      setGeocodedPositions((prev) => ({ ...prev, ...updates }));
    };

    void geocode();

    return () => {
      cancelled = true;
    };
  }, [geocodingLib, geocodedPositions, markers]);

  const markerPositions = useMemo(() => {
    const positions: LatLngLiteral[] = [];
    for (const marker of resolvedMarkers) {
      if (marker.position) {
        positions.push(marker.position);
      }
    }
    return positions;
  }, [resolvedMarkers]);

  const hasLocations = markerPositions.length > 0;

  const defaultCenter = markerPositions[0] ?? DEFAULT_CENTER;
  const defaultZoom = markerPositions.length > 1 ? 11 : 14;

  if (!hasLocations) {
    return (
      <Card>
        <CardBody>
          <p className="text-default-600">
            We could not find map coordinates for these listings yet. Try
            switching back to the list view while we add more map coverage.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <div className="h-[600px] w-full overflow-hidden border border-default-200">
        <Map
          id="directory-map"
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
                title={marker.title}
              />
            );
          })}
        </Map>
      </div>
      <p className="mt-3 text-sm text-default-500">
        Showing {pluralize(markerPositions.length, readableCategory)} in{" "}
        {formattedLocations}.
      </p>
    </>
  );
}

function FitBounds({ positions }: { positions: LatLngLiteral[] }) {
  const map = useMap("directory-map");

  useEffect(() => {
    if (!map || positions.length === 0) {
      return;
    }

    const browserWindow = window as typeof window & {
      google?: typeof google;
    };
    if (!hasGoogle(browserWindow)) {
      return;
    }
    const maps = browserWindow.google.maps;

    if (positions.length === 1) {
      const [firstPosition] = positions;
      if (!firstPosition) return;
      map.setCenter(firstPosition);
      map.setZoom(14);
      return;
    }

    const bounds = new maps.LatLngBounds();
    for (const position of positions) {
      bounds.extend(position);
    }

    map.fitBounds(bounds, 56);
  }, [map, positions]);

  return null;
}

function hasGoogle(
  windowLike: typeof window & { google?: typeof google },
): windowLike is typeof window & { google: typeof google } {
  return typeof windowLike.google !== "undefined";
}
