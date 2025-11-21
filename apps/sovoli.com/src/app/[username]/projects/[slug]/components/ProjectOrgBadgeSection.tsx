import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { BadgeCheckIcon, MapPinIcon } from "lucide-react";

import type { OrgInstance, OrgLocation } from "~/modules/organisations/types";

export interface ProjectOrgBadgeSectionProps {
  orgInstance: OrgInstance;
  location?: OrgLocation;
}

export function ProjectOrgBadgeSection({
  orgInstance,
  location,
}: ProjectOrgBadgeSectionProps) {
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

  // Format address
  const addressParts = location?.address
    ? [
        location.address.line1,
        location.address.city,
        location.address.state,
      ].filter(Boolean)
    : [];

  const addressString = addressParts.join(", ");

  return (
    <section className="mb-6 border-b border-default-200 pb-6">
      <div className="flex items-center gap-4">
        {/* Logo with Score Badge */}
        <div className="shrink-0">
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
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          {/* First Row: Name and Verified Badge */}
          <div className="flex items-center gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              {org.name}
              {org.isVerified && (
                <BadgeCheckIcon className="text-success" size={16} />
              )}
            </h2>
          </div>

          {/* Second Row: Category, Establishment Year, and Address */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-foreground-500">
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
            {addressString && (
              <>
                {(!!firstCategory || !!establishmentYear) && <span>•</span>}
                <div className="flex items-center gap-1">
                  <span>{addressString}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
