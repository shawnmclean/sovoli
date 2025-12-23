"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";
import { XIcon, ExternalLinkIcon } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import { ProgramMap } from "./ProgramMap";

interface MapDetailsProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function MapDetails({ orgInstance, program }: MapDetailsProps) {
  const router = useRouter();
  const { locations } = orgInstance.org;

  // Track analytics when component mounts
  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "map",
    });
  }, [program]);

  // Find the primary location
  const primaryLocation = locations.find((location) => location.isPrimary);

  // Generate maps URL for sharing
  const getMapsUrl = () => {
    if (!primaryLocation) return "";
    if (primaryLocation.placeId) {
      return `https://www.google.com/maps/search/?api=1&query=${primaryLocation.address.line1}&query_place_id=${primaryLocation.placeId}`;
    }
    if (primaryLocation.coordinates) {
      return `https://www.google.com/maps/@?api=1&map_action=map&center=${primaryLocation.coordinates.lat},${primaryLocation.coordinates.lng}`;
    }
    // Fallback to address search
    const addressQuery = encodeURIComponent(
      [
        primaryLocation.address.line1,
        primaryLocation.address.city,
        primaryLocation.address.state,
      ]
        .filter(Boolean)
        .join(", "),
    );
    return `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
  };

  const handleClose = () => {
    router.back();
  };

  if (!primaryLocation) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          isIconOnly
          variant="flat"
          radius="full"
          as="a"
          href={getMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in Google Maps"
          className="bg-background/80 backdrop-blur-sm shadow-sm"
        >
          <ExternalLinkIcon size={18} />
        </Button>
        <Button
          isIconOnly
          color="default"
          onPress={handleClose}
          aria-label="Close map"
          radius="full"
          variant="flat"
          className="bg-background/80 backdrop-blur-sm shadow-sm"
        >
          <XIcon className="h-5 w-5" />
        </Button>
      </div>
      <ProgramMap
        orgInstance={orgInstance}
        mapId="fullscreen-map"
        showZoomControl={true}
        className="h-full w-full"
      />
    </div>
  );
}
