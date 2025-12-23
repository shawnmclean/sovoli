"use client";

import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import type { OrgInstance } from "~/modules/organisations/types";
import { countryCodeToName } from "~/utils/countryUtils";
import type { Program } from "~/modules/academics/types";
import { MapSection } from "./MapSection";

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

  // Format address as a single line, comma separated
  const addressLine = [
    primaryLocation.address.line1,
    primaryLocation.address.line2,
    primaryLocation.address.line3,
    primaryLocation.address.city,
    primaryLocation.address.state,
    primaryLocation.address.postalCode,
    countryCodeToName(primaryLocation.address.countryCode),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          Where {program.audience === "parent" ? "Your Child " : "You "}
          Will Be
        </h3>

        <MapSection orgInstance={orgInstance} programSlug={program.slug} />

        <h3 className="text-default-600">
          {addressLine}
          {primaryLocation.address.landmark && (
            <span className="text-default-500 italic">
              {" "}
              ({primaryLocation.address.landmark})
            </span>
          )}
        </h3>

        <Link
          href={`/programs/${program.slug}/location`}
          className="underline inline-flex items-center gap-1"
        >
          Show more <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
