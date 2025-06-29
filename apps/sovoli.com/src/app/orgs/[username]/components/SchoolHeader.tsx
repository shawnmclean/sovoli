"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import {
  BadgeCheckIcon,
  EllipsisVerticalIcon,
  AlertCircleIcon,
  HeartIcon,
} from "lucide-react";
import { ApplyDialogButton } from "~/app/(directory)/components/ApplyDialogButton";
import { WhatsAppLink } from "~/components/WhatsAppLink";
// import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgInstance } from "~/modules/organisations/types";

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
              fallback={
                <span className="text-xs text-default-500">
                  Logo Not Available
                </span>
              }
            />
          </div>
          <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
            <div className="flex items-center gap-2 w-full sm:justify-start justify-center">
              <h1 className="font-bold text-2xl flex items-center gap-2">
                {orgInstance.org.name}
                {orgInstance.org.isVerified && (
                  <BadgeCheckIcon className="text-success" size={20} />
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2 my-2">
              <span className="text-sm text-default-500">
                Score:{" "}
                {orgInstance.scoringModule
                  ? (
                      (orgInstance.scoringModule.result.scoreSummary
                        .totalScore /
                        orgInstance.scoringModule.result.scoreSummary
                          .maxScore) *
                      10
                    ).toFixed(1)
                  : "-"}
              </span>
              •
              <Chip
                color="success"
                size="sm"
                variant="light"
                className="text-xs gap-1 text-default-500"
                startContent={<HeartIcon size={14} />}
              >
                no likes yet
              </Chip>
              {!orgInstance.org.isVerified && (
                <>
                  •
                  <Tooltip
                    content={
                      <span>
                        This is currently unclaimed. All information is provided
                        by Sovoli.
                        <Divider />
                        Claim and edit this profile to add more information.
                      </span>
                    }
                  >
                    <Chip
                      color="warning"
                      size="sm"
                      variant="flat"
                      className="text-xs gap-1"
                      startContent={<AlertCircleIcon size={14} />}
                    >
                      Unclaimed
                    </Chip>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-2">
            <ApplyDialogButton
              orgName={orgInstance.org.name}
              orgId={orgInstance.org.username}
            >
              Apply
            </ApplyDialogButton>
            {!orgInstance.org.isVerified && (
              <Button
                color="warning"
                as={WhatsAppLink}
                message={`Hello, I'm the admin of ${orgInstance.org.name}. I'd like to claim this profile.`}
                intent="Claim School"
                role="admin"
                page="details"
                orgId={orgInstance.org.username}
                orgName={orgInstance.org.name}
                funnel="admin_claim"
              >
                Claim
              </Button>
            )}
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" isIconOnly>
                <EllipsisVerticalIcon className={iconClasses} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
              <DropdownItem key="schedule-visit">
                <Button
                  fullWidth
                  as={WhatsAppLink}
                  message={`Hello, I'm interested in scheduling a visit to ${orgInstance.org.name}`}
                >
                  Schedule Visit
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
