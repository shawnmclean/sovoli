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
import type { OrgInstance } from "~/modules/organisations/types";
import { ScoringChips } from "~/modules/scoring/components/ScoringChips";
import { ruleSets } from "~/modules/scoring/ruleSets";

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
            {(() => {
              // Import ruleSets from the correct location at the top of your file:
              // import { ruleSets } from "~/modules/scoring/rules";
              const category =
                orgInstance.org.categories[0] ?? "private-school";
              const ruleSet = ruleSets[category];
              if (!ruleSet) return null;
              return (
                <ScoringChips
                  type="slim"
                  scoringModule={orgInstance.scoringModule}
                  ruleSet={ruleSet}
                />
              );
            })()}
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
