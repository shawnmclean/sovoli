import React from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Avatar } from "@sovoli/ui/components/avatar";
import type {
  OrgInstance,
  ScoringDimension,
} from "~/modules/organisations/types";
import type { Program } from "~/modules/academics/types";
import { Chip } from "@sovoli/ui/components/chip";
import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import { Link } from "@sovoli/ui/components/link";

import { Tooltip } from "@sovoli/ui/components/tooltip";

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

const ScoringChips = ({
  scoringModule,
  isVerified,
}: {
  scoringModule: OrgInstance["scoringModule"];
  isVerified: boolean;
}) => (
  <div className="flex flex-wrap gap-1">
    {["digitalScore", "academicScore"].map((key) => {
      const labelMap: Record<string, string> = {
        digitalScore: "Digital",
        academicScore: "Academics",
      };
      const label = labelMap[key] ?? key;
      const dim = scoringModule?.[key as keyof typeof scoringModule] as
        | ScoringDimension
        | undefined;
      const score = dim?.score ?? 0;
      const maxScore = dim?.maxScore ?? 0;
      const percent = maxScore ? (score / maxScore) * 100 : 0;
      const color =
        percent >= 80 ? "success" : percent >= 50 ? "warning" : "default";
      return (
        <Chip
          key={key}
          size="sm"
          color={color}
          variant="flat"
          className="text-xs flex items-center gap-1"
        >
          <span>{label}: </span>
          <span>{score}</span>
          <span className="text-[10px] text-default-400">/</span>
          <span>{maxScore}</span>
        </Chip>
      );
    })}
    {!isVerified && (
      <Chip size="sm" color="warning" variant="flat">
        <span>Unclaimed: </span>
        <span>0</span>
        <span className="text-[10px] text-default-400">/</span>
        <span>10</span>
      </Chip>
    )}
  </div>
);

const ScoringSection = ({ orgInstance }: { orgInstance: OrgInstance }) => {
  const { scoringModule, org } = orgInstance;
  return (
    <div className="mt-2 p-3 bg-default-100 rounded-lg">
      <div className="flex items-center mb-2 gap-2">
        <span className="font-semibold text-sm">
          Score: {scoringModule?.totalScore ?? 0}
        </span>
      </div>
      <ScoringChips
        scoringModule={scoringModule}
        isVerified={org.isVerified ?? false}
      />
    </div>
  );
};
