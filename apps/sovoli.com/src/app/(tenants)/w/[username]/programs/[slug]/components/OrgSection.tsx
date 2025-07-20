import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { Divider } from "@sovoli/ui/components/divider";
import { BadgeCheckIcon } from "lucide-react";

import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";

export interface OrgSectionProps {
  orgInstance: OrgInstance;
}

export function OrgSection({ orgInstance }: OrgSectionProps) {
  const org = orgInstance.org;

  // Calculate score
  const score = orgInstance.scoringModule
    ? (
        (orgInstance.scoringModule.result.scoreSummary.totalScore /
          orgInstance.scoringModule.result.scoreSummary.maxScore) *
        10
      ).toFixed(1)
    : null;

  // Get establishment year from incorporation date
  const establishmentYear = org.verification?.incorporationDate
    ? new Date(org.verification.incorporationDate).getFullYear()
    : null;

  // Get first category
  const firstCategory = org.categories[0];

  return (
    <ProgramSectionsWrapper>
      <div className="flex items-center gap-4">
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
          {/* First Row: Name and Verified Badge */}
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg flex items-center gap-2">
              {org.name}
              {org.isVerified && (
                <BadgeCheckIcon className="text-success" size={16} />
              )}
            </h2>
          </div>

          {/* Second Row: Category and Establishment Year */}
          <div className="flex items-center gap-2 text-sm text-foreground-500">
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
          </div>
        </div>
      </div>
    </ProgramSectionsWrapper>
  );
}
