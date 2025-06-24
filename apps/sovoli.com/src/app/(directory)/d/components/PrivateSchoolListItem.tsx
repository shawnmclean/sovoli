import React from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Avatar } from "@sovoli/ui/components/avatar";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program } from "~/modules/academics/types";
import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import { Link } from "@sovoli/ui/components/link";
import { Tooltip } from "@sovoli/ui/components/tooltip";

import { OrgListItemBreakdown } from "./OrgListItemBreakdown";

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

        <OrgListItemBreakdown orgInstance={orgInstance} />
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
