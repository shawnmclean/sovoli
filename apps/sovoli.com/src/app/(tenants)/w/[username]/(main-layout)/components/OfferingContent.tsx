"use client";

import type { OrgInstance } from "~/modules/organisations/types";
import { CatalogGroupListing } from "./CatalogGroupListing";
import { ProgramGroupListing } from "./ProgramGroupListing";
import { ServiceGroupListing } from "./ServiceGroupListing";

interface OfferingContentProps {
  orgInstance: OrgInstance;
}

export function OfferingContent({ orgInstance }: OfferingContentProps) {
  const { categories } = orgInstance.org;

  const programCategories = new Set([
    "private-school",
    "vocational-school",
    "sewing-school",
    "beauty-school",
    "fashion-school",
    "music-school",
  ]);

  const hasProgramCategories = categories.some((category) =>
    programCategories.has(category),
  );

  // Check if services are available for this tenant
  const hasServices =
    orgInstance.serviceModule?.services &&
    orgInstance.serviceModule.services.length > 0;

  // Build the content array
  const content: React.ReactNode[] = [];

  if (hasServices) {
    content.push(
      <ServiceGroupListing key="services" orgInstance={orgInstance} />,
    );
  }

  if (hasProgramCategories) {
    content.push(
      <ProgramGroupListing key="programs" orgInstance={orgInstance} />,
    );
  }

  if (content.length > 0) {
    return <>{content}</>;
  }

  if (categories.includes("stationery")) {
    return <CatalogGroupListing orgInstance={orgInstance} />;
  }

  // No offering content for other categories
  return null;
}
