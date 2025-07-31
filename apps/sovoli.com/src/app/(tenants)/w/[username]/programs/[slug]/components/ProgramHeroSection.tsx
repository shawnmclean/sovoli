import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import { countryCodeToName } from "~/utils/countryUtils";

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

  const requirement =
    program.requirements ?? program.standardProgramVersion?.requirements;
  const ageReq = requirement?.find((r) => r.type === "age");

  const formatAgeRange = (range: {
    minAgeYears?: number;
    maxAgeYears?: number;
  }) => {
    const min = range.minAgeYears ?? 0;
    return range.maxAgeYears
      ? `Ages ${min}-${range.maxAgeYears}`
      : `Ages ${min} and up`;
  };

  return (
    <ProgramSectionsWrapper className="text-center">
      {/* Program Name */}
      <h1 className="text-3xl leading-tight tracking-tight my-4">
        {programName}
      </h1>

      <p className="text-sm text-foreground-500 max-w-3xl mx-auto">
        {ageReq?.ageRange && formatAgeRange(ageReq.ageRange)}
      </p>

      {/* Primary Location */}
      {primaryLocation && (
        <div className="flex justify-center gap-2 text-foreground-500">
          <span className="text-sm">
            {`${primaryLocation.address.city}`},{" "}
            {countryCodeToName(primaryLocation.address.countryCode)}
          </span>
        </div>
      )}
    </ProgramSectionsWrapper>
  );
};
