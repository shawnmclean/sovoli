"use client";

import Link from "next/link";
import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramMap } from "./ProgramMap";

interface MapSectionProps {
  orgInstance: OrgInstance;
  programSlug: string;
  className?: string;
}

export function MapSection({
  orgInstance,
  programSlug,
  className,
}: MapSectionProps) {
  return (
    <Link
      href={`/programs/${programSlug}/map`}
      className={`block ${className ?? ""}`}
    >
      <div className="h-[300px] w-full overflow-hidden border border-default-200 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
        <ProgramMap
          orgInstance={orgInstance}
          mapId="location-map"
          showZoomControl={false}
          disableAllControls={true}
          className="h-full w-full"
        />
      </div>
    </Link>
  );
}
