import React from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Avatar } from "@sovoli/ui/components/avatar";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program } from "~/modules/academics/types";
import { ArrowRightIcon, CheckCircleIcon, Info } from "lucide-react";
import { Link } from "@sovoli/ui/components/link";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { ruleSets } from "~/modules/scoring/ruleSets";
import { ScoringProgress } from "~/modules/scoring/components/ScoringProgress";

interface PrivateSchoolListItemProps {
  orgInstance: OrgInstance;
}

export function PrivateSchoolListItem({
  orgInstance,
}: PrivateSchoolListItemProps) {
  const { org, academicModule } = orgInstance;

  return (
    <Card className="w-full">
      <CardBody className="gap-2">
        <Link href={`/orgs/${org.username}`} color="foreground">
          <div className="flex items-center gap-3">
            <Avatar src={org.logo} name={org.name} size="md" />

            <div className="flex-grow">
              <div className="flex items-center gap-1">
                <h2 className="text-md font-bold line-clamp-2">{org.name}</h2>
                {org.isVerified && (
                  <Tooltip content="This school has been verified by Sovoli">
                    <CheckCircleIcon className="w-4 h-4 text-success shrink-0" />
                  </Tooltip>
                )}
              </div>

              <p className="text-xs text-default-500 capitalize">
                {org.locations[0]?.address.city}
              </p>
            </div>
          </div>
        </Link>

        <ProgramList programs={academicModule?.programs ?? []} />

        {/* Scoring Section */}
        <ScoringSection orgInstance={orgInstance} />
      </CardBody>

      <CardFooter className="border-t border-default-200 flex justify-end">
        <Button
          color={org.isVerified ? "primary" : "default"}
          as="a"
          href={`/orgs/${org.username}`}
          size="sm"
          endContent={<ArrowRightIcon className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          {org.isVerified
            ? "Explore Programs and Apply"
            : "Claim and Edit this School"}
        </Button>
      </CardFooter>
    </Card>
  );
}

const ProgramList = ({ programs }: { programs: Program[] }) => {
  const maxVisible = 3;
  const visiblePrograms = programs.slice(0, maxVisible);
  const remaining = programs.length - maxVisible;

  return (
    <div className="flex items-center text-xs text-default-500">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        Programs: {visiblePrograms.map((p) => p.name).join(" · ")}
      </p>
      {remaining > 0 && (
        <span className="ml-1 shrink-0 text-primary-600 font-medium">
          · +{remaining} more
        </span>
      )}
    </div>
  );
};

const ScoringSection = ({ orgInstance }: { orgInstance: OrgInstance }) => {
  const { scoringModule, org } = orgInstance;
  const ruleSet = ruleSets[org.categories[0] ?? "private-school"];
  if (!ruleSet) return null;

  const totalScore = scoringModule.result.scoreSummary.totalScore;
  const maxScore = scoringModule.result.scoreSummary.maxScore;

  const scoreOutOf10 = maxScore
    ? Math.round((totalScore / maxScore) * 10 * 10) / 10
    : 0;

  return (
    <div className="mt-2 p-3 bg-default-100 rounded-lg">
      <div className="flex items-center mb-2 gap-2 justify-between">
        <span className="font-semibold text-sm">
          Score: {scoreOutOf10} / 10
        </span>
        <Tooltip content="View detailed scoring breakdown">
          <Link
            href={`/orgs/${org.username}/scores`}
            color="foreground"
            className="w-6 h-6 min-w-6"
          >
            <Info className="w-4 h-4" />
          </Link>
        </Tooltip>
      </div>
      <ScoringProgress scoringModule={scoringModule} ruleSet={ruleSet} />
    </div>
  );
};
