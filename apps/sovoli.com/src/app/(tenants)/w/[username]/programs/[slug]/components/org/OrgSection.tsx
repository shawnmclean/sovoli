import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { Link } from "@sovoli/ui/components/link";
import { BadgeCheckIcon } from "lucide-react";

import type { OrgInstance } from "~/modules/organisations/types";

export interface OrgSectionProps {
  orgInstance: OrgInstance;
  programSlug?: string;
}

export function OrgSection({ orgInstance, programSlug }: OrgSectionProps) {
  const org = orgInstance.org;

  // Calculate score
  const score = orgInstance.scoringModule
    ? (() => {
        const { totalScore, maxScore } =
          orgInstance.scoringModule.result.scoreSummary;
        const rawScore = (totalScore / maxScore) * 10;
        return Number.isNaN(rawScore) || !Number.isFinite(rawScore)
          ? 0
          : rawScore.toFixed(1);
      })()
    : 0;

  // Get establishment year from incorporation date
  const establishmentYear = org.verification?.incorporationDate
    ? new Date(org.verification.incorporationDate).getFullYear()
    : null;

  // Get first category
  const firstCategory = org.categories[0];

  const content = (
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
            src={org.logoPhoto?.url}
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
        <h2 className="font-bold text-lg text-foreground leading-tight">
          {org.name}
          {org.isVerified && (
            <BadgeCheckIcon
              className="text-success inline-block ml-2 align-middle"
              size={20}
              style={{ verticalAlign: "middle" }}
            />
          )}
        </h2>

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
  );

  return (
    <section className="mt-4 mb-6 border-b border-default-200 pb-6">
      {programSlug ? (
        <Link
          href={`/programs/${programSlug}/org`}
          className="block hover:opacity-80 transition-opacity"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </section>
  );
}
