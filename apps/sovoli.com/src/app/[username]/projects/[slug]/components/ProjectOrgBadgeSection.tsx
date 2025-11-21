import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { BadgeCheckIcon } from "lucide-react";

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

  // Get first category
  const firstCategory = org.categories[0];

  // Format address
  const addressParts = location?.address
    ? [location.address.city, location.address.state].filter(Boolean)
    : [];

  const addressString = addressParts.join(", ");

  return (
    <section className="mb-6 border-b border-default-200 pb-6">
      <div className="flex items-center gap-4">
        {/* Logo with Score Badge */}
        <div className="shrink-0">
          <Avatar src={org.logo} name={org.name} size="lg" />
        </div>

        {/* Organization Info */}
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          {/* First Line: School name (badge) */}
          <div className="flex items-center gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              {org.name}
              {org.isVerified && (
                <BadgeCheckIcon className="text-success" size={16} />
              )}
            </h2>
          </div>

          {/* Second Line: Category • Address */}
          <div className="flex items-center gap-2 text-sm text-foreground-500">
            {firstCategory && (
              <span className="capitalize">
                {firstCategory.replace("-", " ")}
              </span>
            )}
            {addressString && (
              <>
                {firstCategory && <span>•</span>}
                <span>{addressString}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
