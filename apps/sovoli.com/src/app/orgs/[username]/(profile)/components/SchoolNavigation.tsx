"use client";

import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import type { OrgInstance } from "~/modules/organisations/types";
import { usePathname } from "next/navigation";
import { Chip } from "@sovoli/ui/components/chip";

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

  // eslint-disable-next-line prefer-const
  let jobsCount = 0;

  return (
    <Tabs
      aria-label="Navigation"
      variant="underlined"
      selectedKey={pathname}
      fullWidth
      className="border-t border-default-200 py-2"
    >
      <Tab
        key={`/orgs/${orgInstance.org.username}`}
        title="About"
        href={`/orgs/${orgInstance.org.username}`}
      />
      <Tab
        key={`/orgs/${orgInstance.org.username}/programs`}
        title={
          <div className="flex items-center space-x-2">
            <span>Programs</span>
            <Chip size="sm" variant="flat">
              {orgInstance.academicModule?.programs.length ?? 0}
            </Chip>
          </div>
        }
        href={`/orgs/${orgInstance.org.username}/programs`}
      />
      <Tab
        key={`/orgs/${orgInstance.org.username}/scores`}
        title={
          <div className="flex items-center space-x-2">
            <span>Scores</span>
            <Chip size="sm" variant="flat">
              {scoreOutOf10}
            </Chip>
          </div>
        }
        href={`/orgs/${orgInstance.org.username}/scores`}
      />

      <Tab
        key={`/orgs/${orgInstance.org.username}/jobs`}
        title={
          <div className="flex items-center space-x-2">
            <span>Jobs</span>
            {jobsCount > 0 ? (
              <Chip
                size="sm"
                variant="solid"
                color="primary"
                className="font-bold shadow-md animate-pulse"
              >
                {jobsCount}
              </Chip>
            ) : null}
          </div>
        }
        // href={`/orgs/${orgInstance.org.username}/jobs`}
      />
      <Tab
        key={`/orgs/${orgInstance.org.username}/logs`}
        title="Logs"
        href={`/orgs/${orgInstance.org.username}/logs`}
      />
    </Tabs>
  );
}
