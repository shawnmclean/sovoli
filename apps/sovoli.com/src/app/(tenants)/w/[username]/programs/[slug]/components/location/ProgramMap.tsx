"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { SchoolIcon } from "lucide-react";
import { env } from "~/env";
import type { OrgInstance } from "~/modules/organisations/types";
import { Skeleton } from "@sovoli/ui/components/skeleton";

interface LatLngLiteral {
  lat: number;
  lng: number;
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

interface ProgramMapProps {
  orgInstance: OrgInstance;
  mapId: string;
  className?: string;
  showZoomControl?: boolean;
  defaultZoom?: number;
  disableAllControls?: boolean;
}

const DEFAULT_CENTER: LatLngLiteral = { lat: 18.0, lng: -77.5 };

function CustomPin() {
  return (
    <div className="relative -translate-y-1 transition-transform duration-200 ease-in-out">
      {/* Main circular pin body */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary p-2 shadow-lg">
        <SchoolIcon className="h-5 w-5 text-primary-foreground" />
      </div>
      {/* Tip pointer using border trick */}
      <div
        className="absolute bottom-0 left-1/2 z-[-1] h-0 w-0 -translate-x-1/2 translate-y-[30%] rotate-45 border-[10px] border-primary"
        style={{
          borderBottomRightRadius: "4px",
          borderTop: "none",
          borderLeft: "none",
        }}
      />
    </div>
  );
}

function ProgramMapContent({
  orgInstance,
  mapId,
  className,
  showZoomControl = true,
  defaultZoom = 14,
  disableAllControls = false,
}: ProgramMapProps) {
  const { resolvedTheme } = useTheme();
  const geocodingLib = useMapsLibrary("geocoding") as GeocodingLibrary | null;
  const { locations } = orgInstance.org;

  const isDark = resolvedTheme === "dark";

  // Find the primary location
  const primaryLocation = locations.find((location) => location.isPrimary);

  const [geocodedPosition, setGeocodedPosition] =
    useState<LatLngLiteral | null>(null);

  const markerPosition = useMemo(() => {
    if (primaryLocation?.coordinates) {
      return {
        lat: primaryLocation.coordinates.lat,
        lng: primaryLocation.coordinates.lng,
      };
    }
    return geocodedPosition;
  }, [primaryLocation, geocodedPosition]);

  useEffect(() => {
    if (!geocodingLib || !primaryLocation) return;
    if (primaryLocation.coordinates) return;
    if (geocodedPosition) return;

    let cancelled = false;
    const geocoder = new geocodingLib.Geocoder();

    const geocode = () => {
      const addressString = [
        primaryLocation.address.line1,
        primaryLocation.address.city,
        primaryLocation.address.state,
      ]
        .filter(Boolean)
        .join(", ");

      const request: google.maps.GeocoderRequest | null =
        primaryLocation.placeId
          ? { placeId: primaryLocation.placeId }
          : addressString
            ? { address: addressString }
            : null;

      if (!request) {
        return;
      }

      geocoder.geocode(request, (results, status) => {
        if (cancelled) {
          return;
        }

        if (
          status !== google.maps.GeocoderStatus.OK ||
          !results ||
          results.length === 0
        ) {
          return;
        }

        const [firstResult] = results;
        if (!firstResult) {
          return;
        }

        const location = firstResult.geometry.location;

        setGeocodedPosition({
          lat: location.lat(),
          lng: location.lng(),
        });
      });
    };

    void geocode();

    return () => {
      cancelled = true;
    };
  }, [geocodingLib, primaryLocation, geocodedPosition]);

  if (!primaryLocation) {
    return null;
  }

  const center = markerPosition ?? DEFAULT_CENTER;

  if (!markerPosition) {
    return (
      <Skeleton
        className={
          className ?? "h-[300px] w-full rounded-lg border border-default-200"
        }
      />
    );
  }

  // We don't need a map id for just advanced markers, but putting this here for future reference.
  // see: https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over
  const googleMapId =
    (env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string | undefined) ?? "DEMO_MAP_ID";

  return (
    <GoogleMap
      id={mapId}
      mapId={googleMapId}
      defaultCenter={center}
      defaultZoom={defaultZoom}
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl={false}
      zoomControl={disableAllControls ? false : showZoomControl}
      className={className ?? "h-full w-full"}
      gestureHandling="greedy"
      disableDefaultUI={disableAllControls}
      colorScheme={isDark ? "DARK" : "LIGHT"}
    >
      <FitBounds position={markerPosition} mapId={mapId} />
      <AdvancedMarker position={markerPosition} title={orgInstance.org.name}>
        <CustomPin />
      </AdvancedMarker>
    </GoogleMap>
  );
}

function FitBounds({
  position,
  mapId,
}: {
  position: LatLngLiteral;
  mapId: string;
}) {
  const map = useMap(mapId);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.setCenter(position);
    map.setZoom(14);
  }, [map, position]);

  return null;
}

export function ProgramMap({
  orgInstance,
  mapId,
  className,
  showZoomControl = true,
  defaultZoom = 14,
  disableAllControls = false,
}: ProgramMapProps) {
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className={
          className ??
          "h-[300px] w-full flex items-center justify-center border border-default-200 rounded-lg bg-default-50"
        }
      >
        <p className="text-default-600 text-sm">
          Map view is currently unavailable.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["geocoding", "marker"]}>
      <ProgramMapContent
        orgInstance={orgInstance}
        mapId={mapId}
        className={className}
        showZoomControl={showZoomControl}
        defaultZoom={defaultZoom}
        disableAllControls={disableAllControls}
      />
    </APIProvider>
  );
}
