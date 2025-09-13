import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { BadgeCheckIcon } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import { countryCodeToName } from "~/utils/countryUtils";
import type { Program } from "~/modules/academics/types";

export interface OrgLandingSectionProps {
  orgInstance: OrgInstance;
}

export function OrgLandingSection({ orgInstance }: OrgLandingSectionProps) {
  const org = orgInstance.org;

  // Calculate score
  const score = orgInstance.scoringModule
    ? (() => {
        const { totalScore, maxScore } =
          orgInstance.scoringModule.result.scoreSummary;
        const rawScore = (totalScore / maxScore) * 10;
        return isNaN(rawScore) || !isFinite(rawScore) ? 0 : rawScore.toFixed(1);
      })()
    : 0;

  // Get establishment year from incorporation date
  const establishmentYear = org.verification?.incorporationDate
    ? new Date(org.verification.incorporationDate).getFullYear()
    : null;

  // Get first category
  const firstCategory = org.categories[0];

  // Get primary location
  const primaryLocation = org.locations.find((loc) => loc.isPrimary);

  // Calculate age range from all programs
  const ageRange = (() => {
    const programs = orgInstance.academicModule?.programs;
    if (!programs || programs.length === 0) return null;

    const allAges: number[] = [];

    programs.forEach((program) => {
      const admission =
        program.admission ?? program.standardProgramVersion?.admission;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const ageReq = admission?.eligibility.find((r) => r.type === "age");

      if (ageReq?.ageRange) {
        if (ageReq.ageRange.minAgeYears !== undefined) {
          allAges.push(ageReq.ageRange.minAgeYears);
        }
        if (ageReq.ageRange.maxAgeYears !== undefined) {
          allAges.push(ageReq.ageRange.maxAgeYears);
        }
      }
    });

    if (allAges.length === 0) return null;

    const minAge = Math.min(...allAges);
    const maxAge = Math.max(...allAges);

    return minAge === maxAge ? `Ages ${minAge}` : `Ages ${minAge}-${maxAge}`;
  })();

  return (
    <div className="flex items-center gap-4 text-left border-b border-default-200 pb-4">
      {/* Logo with Score Badge */}
      <div className="flex-shrink-0">
        <Badge
          color="secondary"
          variant="solid"
          content={score}
          size="sm"
          placement="bottom-right"
          shape="circle"
        >
          <Avatar
            src={org.logo}
            name={org.name}
            size="lg"
            fallback={
              <span className="text-xs text-default-500">
                Logo Not Available
              </span>
            }
          />
        </Badge>
      </div>

      {/* Organization Info */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Name with Verified Badge */}
        <div className="flex items-center gap-1">
          <h1 className="font-bold text-lg flex items-center gap-1">
            {org.name}
            {org.isVerified && (
              <BadgeCheckIcon className="text-success" size={16} />
            )}
          </h1>
        </div>

        {/* Category, Establishment Year, and Age Range */}
        <div className="flex items-center gap-1 text-sm text-foreground-500">
          {firstCategory && (
            <span className="capitalize">
              {firstCategory.replace("-", " ")}
            </span>
          )}
          {establishmentYear && (
            <>
              {firstCategory && <span>•</span>}
              <span>Est. {establishmentYear}</span>
            </>
          )}
          {ageRange && (
            <>
              {(firstCategory ?? establishmentYear) && <span>•</span>}
              <span>{ageRange}</span>
            </>
          )}
        </div>

        {/* Primary Location */}
        {primaryLocation && (
          <div className="flex gap-1 text-foreground-500">
            <span className="text-xs">
              {`${primaryLocation.address.city}`},{" "}
              {countryCodeToName(primaryLocation.address.countryCode)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
