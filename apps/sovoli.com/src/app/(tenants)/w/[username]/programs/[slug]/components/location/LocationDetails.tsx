"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { MapIcon, MapPinIcon } from "lucide-react";
import { useEffect } from "react";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";
import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { countryCodeToName } from "~/utils/countryUtils";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import { SubscribeProgramButton } from "../SubscribeProgramButton";

interface LocationDetailsProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function LocationDetails({
  orgInstance,
  program,
}: LocationDetailsProps) {
  const { locations } = orgInstance.org;

  // Track analytics when component mounts
  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "location",
    });
  }, [program]);

  // Find the primary location
  const primaryLocation = locations.find((location) => location.isPrimary);

  if (!primaryLocation) {
    return null;
  }

  // Format address as a string
  const addressLines = [
    primaryLocation.address.line1,
    primaryLocation.address.line2,
    primaryLocation.address.line3,
    [primaryLocation.address.city, primaryLocation.address.state]
      .filter(Boolean)
      .join(", "),
    primaryLocation.address.postalCode,
    countryCodeToName(primaryLocation.address.countryCode),
  ]
    .filter(Boolean)
    .join("\n");

  // Generate maps URL
  const getMapsUrl = () => {
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

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader
            showBackButton
            onBackPress={onClose}
            endContent={
              <>
                <ShareButton
                  title="Share"
                  variant="light"
                  text={`Check out ${program.name} location.`}
                />
                <SubscribeProgramButton program={program} variant="light" />
              </>
            }
          />
          <DrawerBody>
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-primary" />
                Where {program.audience === "parent" ? "Your Child " : "You "}
                Will Be
              </h1>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-1 text-default-500 shrink-0" />
                  <div>
                    <address className="not-italic text-default-600 whitespace-pre-line">
                      {addressLines}
                    </address>
                    {primaryLocation.address.landmark && (
                      <p className="text-sm text-default-500 italic mt-1">
                        {primaryLocation.address.landmark}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  color="primary"
                  variant="flat"
                  startContent={<MapIcon />}
                  as="a"
                  href={getMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                  radius="full"
                >
                  View on Map
                </Button>
              </div>
            </div>
          </DrawerBody>
        </>
      )}
    </DrawerContent>
  );
}
