"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
  NotebookPenIcon,
} from "lucide-react";
import { ApplyDialogButton } from "~/app/(directory)/components/ApplyDialogButton";
// import { WhatsAppButton } from "~/components/WhatsAppButton";
import type {
  OrgInstance,
  ScoringDimension,
} from "~/modules/organisations/types";

export interface SchoolHeaderProps {
  orgInstance: OrgInstance;
}

export function SchoolHeader({ orgInstance }: SchoolHeaderProps) {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <div className="w-full md:w-1/3 p-4">
      <div className="flex flex-col gap-4">
        <div
          className="
            flex flex-col items-center text-center gap-3
            sm:flex-row sm:items-center sm:text-left sm:gap-4
          "
        >
          <div className="flex justify-center sm:justify-start sm:flex-shrink-0">
            <Avatar
              src={orgInstance.org.logo}
              name={orgInstance.org.name}
              size="lg"
              className="h-20 w-20"
            />
          </div>
          <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start w-full gap-2">
              <h1 className="font-bold text-2xl leading-tight truncate">
                {orgInstance.org.name}
              </h1>
              {orgInstance.org.isVerified && (
                <Tooltip content="This organization has been verified by Sovoli">
                  <CheckCircleIcon className="w-5 h-5 text-success" />
                </Tooltip>
              )}
            </div>
            <ScoringChips
              scoringModule={orgInstance.scoringModule}
              isVerified={orgInstance.org.isVerified ?? false}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-2">
            <ApplyDialogButton orgName={orgInstance.org.name}>
              Apply
            </ApplyDialogButton>
            <Button fullWidth>Schedule Visit</Button>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" isIconOnly>
                <EllipsisVerticalIcon className={iconClasses} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
              <DropdownItem
                key="edit"
                startContent={<NotebookPenIcon className={iconClasses} />}
              >
                Edit Profile
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {/* {!orgInstance.org.isVerified ? (
            <WhatsAppButton
              phoneNumber="+5926082743"
              message={`Hello, I'd like to claim and edit the profile for ${orgInstance.org.name}.`}
            >
              Claim and Edit
            </WhatsAppButton>
          ) : null} */}
        </div>
      </div>
    </div>
  );
}

const ScoringChips = ({
  scoringModule,
  isVerified,
}: {
  scoringModule: OrgInstance["scoringModule"];
  isVerified: boolean;
}) => (
  <div className="flex flex-wrap gap-1 mt-2">
    <Chip size="sm" color="default" variant="solid" title="Total Score">
      Score: {scoringModule?.totalScore ?? 0}
    </Chip>
    {["digitalScore"].map((key) => {
      const labelMap: Record<string, string> = {
        digitalScore: "Digital",
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
