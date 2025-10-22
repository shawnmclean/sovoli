"use client";

import { SchoolProgramSearchContent } from "./SchoolProgramSearchContent";

interface StationarySearchContentProps {
  onSearchStart?: () => void;
  onSearchComplete?: (resultsFound: number) => void;
  source?: "landing_page" | "mobile_drawer" | "search_page";
}

export function StationarySearchContent({
  onSearchStart,
  onSearchComplete,
  source = "landing_page",
}: StationarySearchContentProps) {
  return (
    <div className="mb-18">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        Find What You Need
      </h1>
      <div className="flex flex-col gap-4 my-2">
        <SchoolProgramSearchContent
          source={source}
          onSearchStart={onSearchStart}
          onSearchComplete={onSearchComplete}
        />
      </div>
    </div>
  );
}
