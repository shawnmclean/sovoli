import { MapPinIcon } from "lucide-react";

import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";

export interface ProgramHeroSectionProps {
  orgInstance: OrgInstance;
  program: Program;
}

export const ProgramHeroSection = ({
  orgInstance,
  program,
}: ProgramHeroSectionProps) => {
  const org = orgInstance.org;
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "Program";

  // Get primary location
  const primaryLocation = org.locations.find((loc) => loc.isPrimary);

  return (
    <ProgramSectionsWrapper>
      <div className="text-center space-y-6">
        {/* Program Name */}
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
            {programName}
          </span>
        </h1>

        {/* Tagline */}
        {program.tagline && (
          <p className="text-lg lg:text-xl text-foreground-600 font-medium max-w-3xl mx-auto">
            {program.tagline}
          </p>
        )}

        {/* Primary Location */}
        {primaryLocation && (
          <div className="flex items-center justify-center gap-2 text-foreground-500">
            <MapPinIcon className="h-4 w-4" />
            <span className="text-sm">{`${primaryLocation.address.city}`}</span>
          </div>
        )}
      </div>
    </ProgramSectionsWrapper>
  );
};
