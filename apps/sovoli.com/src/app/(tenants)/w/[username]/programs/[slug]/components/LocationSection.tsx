import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { MapPinIcon, MapIcon } from "lucide-react";

import type { OrgInstance } from "~/modules/organisations/types";
import { countryCodeToName } from "~/utils/countryUtils";
import { Program } from "~/modules/academics/types";

interface LocationSectionProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function LocationSection({
  orgInstance,
  program,
}: LocationSectionProps) {
  const { locations } = orgInstance.org;

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
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <h3 className="text-xl font-bold text-foreground">
          Where {program.audience === "parent" ? "Your Child " : "You "}
          Will Be
        </h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPinIcon className="mt-1 text-default-500 flex-shrink-0" />
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
            className="mt-3"
          >
            View on Map
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
