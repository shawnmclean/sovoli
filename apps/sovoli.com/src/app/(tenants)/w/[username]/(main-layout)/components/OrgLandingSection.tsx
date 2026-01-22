import { Avatar } from "@sovoli/ui/components/avatar";
// import { Badge } from "@sovoli/ui/components/badge";
import { BadgeCheckIcon } from "lucide-react";
import { getOrgCategoryDisplay } from "~/modules/organisations/getOrgCategoryDisplay";
import type { OrgInstance } from "~/modules/organisations/types";
import { countryCodeToName } from "~/utils/countryUtils";

export interface OrgLandingSectionProps {
  orgInstance: OrgInstance;
}

export function OrgLandingSection({ orgInstance }: OrgLandingSectionProps) {
  const org = orgInstance.org;

  // Calculate score
  // const score = orgInstance.scoringModule
  //   ? (() => {
  //       const { totalScore, maxScore } =
  //         orgInstance.scoringModule.result.scoreSummary;
  //       const rawScore = (totalScore / maxScore) * 10;
  //       return isNaN(rawScore) || !isFinite(rawScore) ? 0 : rawScore.toFixed(1);
  //     })()
  //   : 0;

  // Get establishment year from incorporation date (only show if >= 5 years old)
  const establishmentYear = (() => {
    const incorporationDate = org.verification?.incorporationDate;
    if (!incorporationDate) return null;

    const incorporatedAt = new Date(incorporationDate);
    if (Number.isNaN(incorporatedAt.getTime())) return null;

    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 5);

    // Hide establishment for younger orgs (< 5 years old)
    if (incorporatedAt > cutoff) return null;

    return incorporatedAt.getFullYear();
  })();

  const categoryText = getOrgCategoryDisplay(org);

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
      <div className="shrink-0">
        {/* <Badge
          color="secondary"
          variant="solid"
          content={score}
          size="sm"
          placement="bottom-right"
          shape="circle"
        > */}
        <Avatar
          src={org.logoPhoto?.url}
          name={org.name}
          size="lg"
          fallback={
            <span className="text-xs text-default-500">Logo Not Available</span>
          }
        />
        {/* </Badge> */}
      </div>

      {/* Organization Info */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Name (match program org section style) */}
        <h1 className="font-bold text-lg text-foreground leading-tight">
          {org.name}
          {org.isVerified && (
            <BadgeCheckIcon
              className="text-success inline-block ml-2 align-middle"
              size={20}
              style={{ verticalAlign: "middle" }}
            />
          )}
        </h1>

        {/* Category, Establishment Year, and Age Range */}
        <div className="flex items-center gap-1 text-sm text-foreground-500">
          {categoryText ? <span>{categoryText}</span> : null}
          {establishmentYear && (
            <>
              {categoryText ? <span>•</span> : null}
              <span>Est. {establishmentYear}</span>
            </>
          )}
          {ageRange && (
            <>
              {(categoryText ?? establishmentYear) ? <span>•</span> : null}
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
