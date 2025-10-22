"use client";

import type { OrgInstance } from "~/modules/organisations/types";
import { PrivateSchoolSearchContent } from "./PrivateSchoolSearchContent";
import { StationarySearchContent } from "./StationarySearchContent";

interface SearchContentProps {
  orgInstance: OrgInstance;
  source?: "landing_page" | "search_page" | "mobile_drawer";
  onSearchStart?: () => void;
  onSearchComplete?: (resultsFound: number) => void;
}

export function SearchContent({
  orgInstance,
  source = "landing_page",
  onSearchStart,
  onSearchComplete,
}: SearchContentProps) {
  const { categories } = orgInstance.org;

  if (categories.includes("private-school")) {
    return (
      <PrivateSchoolSearchContent
        source={source}
        onSearchStart={onSearchStart}
        onSearchComplete={onSearchComplete}
      />
    );
  }

  if (categories.includes("stationary")) {
    return (
      <StationarySearchContent
        source={source}
        onSearchStart={onSearchStart}
        onSearchComplete={onSearchComplete}
      />
    );
  }

  // No search content for other categories
  return null;
}
