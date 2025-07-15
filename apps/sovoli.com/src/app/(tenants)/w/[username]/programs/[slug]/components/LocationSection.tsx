import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { MapPinIcon, MapIcon } from "lucide-react";

import type { OrgInstance } from "~/modules/organisations/types";
import { countryCodeToName } from "~/utils/countryUtils";

interface LocationSectionProps {
  orgInstance: OrgInstance;
}

export function LocationSection({ orgInstance }: LocationSectionProps) {
  const { locations } = orgInstance.org;

  // Find the primary location
  const primaryLocation = locations.find((location) => location.isPrimary);

  if (!primaryLocation) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <h3 className="text-xl font-bold text-foreground">Where you'll be</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-foreground-600">
            Location information not available.
          </p>
        </CardBody>
      </Card>
    );
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
      return `https://www.google.com/maps/place/?q=place_id:${primaryLocation.placeId}`;
    }
    if (primaryLocation.coordinates) {
      return `https://maps.google.com/?q=${primaryLocation.coordinates.lat},${primaryLocation.coordinates.lng}`;
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
    return `https://maps.google.com/?q=${addressQuery}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <h3 className="text-xl font-bold text-foreground">Where you'll be</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPinIcon className="mt-1 text-default-500 flex-shrink-0" />
            <address className="not-italic text-default-600 whitespace-pre-line">
              {addressLines}
            </address>
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
