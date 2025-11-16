"use client";

import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramGroupListing } from "./ProgramGroupListing";
import { CatalogGroupListing } from "./CatalogGroupListing";

interface OfferingContentProps {
  orgInstance: OrgInstance;
}

export function OfferingContent({ orgInstance }: OfferingContentProps) {
  const { categories } = orgInstance.org;

  if (
    categories.includes("private-school") ||
    categories.includes("vocational-school")
  ) {
    return <ProgramGroupListing orgInstance={orgInstance} />;
  }

  if (categories.includes("stationery")) {
    return <CatalogGroupListing orgInstance={orgInstance} />;
  }

  // No offering content for other categories
  return null;
}
