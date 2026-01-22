"use client";

import { Chip } from "@sovoli/ui/components/chip";
import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import { usePathname } from "next/navigation";
import type { OrgInstance } from "~/modules/organisations/types";

export interface SchoolNavigationProps {
  orgInstance: OrgInstance;
}

export function SchoolNavigation({ orgInstance }: SchoolNavigationProps) {
  const pathname = usePathname();

  const scoreOutOf10 = orgInstance.scoringModule?.result.scoreSummary.totalScore
    ? Math.round(
        (orgInstance.scoringModule.result.scoreSummary.totalScore /
          orgInstance.scoringModule.result.scoreSummary.maxScore) *
          10 *
          10,
      ) / 10
    : 0;

  return (
    <Tabs
      aria-label="Navigation"
      variant="underlined"
      selectedKey={pathname}
      fullWidth
      className="border-t border-default-200 py-2"
    >
      <Tab
        key={`/${orgInstance.org.username}`}
        title="About"
        href={`/${orgInstance.org.username}`}
      />
      <Tab
        key={`/${orgInstance.org.username}/programs`}
        title={
          <div className="flex items-center space-x-2">
            <span>Programs</span>
            <Chip size="sm" variant="flat">
              {orgInstance.academicModule?.programs.length ?? 0}
            </Chip>
          </div>
        }
        href={`/${orgInstance.org.username}/programs`}
      />
      <Tab
        key={`/${orgInstance.org.username}/scores`}
        title={
          <div className="flex items-center space-x-2">
            <span>Scores</span>
            <Chip size="sm" variant="flat">
              {scoreOutOf10}
            </Chip>
          </div>
        }
        href={`/${orgInstance.org.username}/scores`}
      />

      <Tab
        key={`/${orgInstance.org.username}/jobs`}
        title={
          <div className="flex items-center space-x-2">
            <span>Jobs</span>
          </div>
        }
        // href={`/${orgInstance.org.username}/jobs`}
      />
      <Tab
        key={`/${orgInstance.org.username}/logs`}
        title="Logs"
        href={`/${orgInstance.org.username}/logs`}
      />
    </Tabs>
  );
}
