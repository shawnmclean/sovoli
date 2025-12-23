"use client";

import Link from "next/link";
import { Maximize2Icon } from "lucide-react";
import { Button } from "@sovoli/ui/components/button";
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
      className={`block relative ${className ?? ""}`}
    >
      <div className="h-[400px] w-full overflow-hidden border border-default-200 rounded-lg cursor-pointer hover:border-primary-400 transition-colors relative">
        <ProgramMap
          orgInstance={orgInstance}
          mapId="location-map"
          showZoomControl={false}
          disableAllControls={true}
          className="h-full w-full"
        />
        <div className="absolute top-2 right-2 z-10">
          <Button
            isIconOnly
            variant="flat"
            color="default"
            radius="full"
            className="bg-background/80 backdrop-blur-sm shadow-sm"
            aria-label="Expand map"
          >
            <Maximize2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
