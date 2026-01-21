"use client";

import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramGroupListing } from "./ProgramGroupListing";
import { CatalogGroupListing } from "./CatalogGroupListing";

interface OfferingContentProps {
  orgInstance: OrgInstance;
}

export function OfferingContent({ orgInstance }: OfferingContentProps) {
  const { categories } = orgInstance.org;

  const programCategories = new Set([
    "private-school",
    "vocational-school",
    "beauty-school",
    "fashion-school",
    "music-school",
  ]);

  if (
    categories.some((category) => programCategories.has(category))
  ) {
    return <ProgramGroupListing orgInstance={orgInstance} />;
  }

  if (categories.includes("stationery")) {
    return <CatalogGroupListing orgInstance={orgInstance} />;
  }

  // No offering content for other categories
  return null;
}
