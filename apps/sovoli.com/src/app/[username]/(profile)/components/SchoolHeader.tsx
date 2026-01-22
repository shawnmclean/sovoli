"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Link } from "@sovoli/ui/components/link";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import {
  AlertCircleIcon,
  BadgeCheckIcon,
  DollarSignIcon,
  EllipsisVerticalIcon,
  HeartIcon,
} from "lucide-react";
import { ApplyDialogButton } from "~/app/(directory)/components/ApplyDialogButton";
import { WhatsAppLink } from "~/components/WhatsAppLink";

import type { OrgInstance } from "~/modules/organisations/types";

export interface SchoolHeaderProps {
  orgInstance: OrgInstance;
}

// Utility function to format currency amounts (e.g., 2000 -> "2k", 15000 -> "15k")
function formatCurrencyAmount(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k`;
  }
  return amount.toString();
}

export function computeFeeRange(orgInstance: OrgInstance): string {
  const programs = orgInstance.academicModule?.programs ?? [];

  if (programs.length === 0) {
    return "NA";
  }

  const gydFees: number[] = [];

  for (const program of programs) {
    const latestCycle = program.cycles?.[0];
    const feeItems = latestCycle?.pricingPackage.pricingItems;
    if (!feeItems) {
      continue;
    }

    for (const fee of feeItems) {
      const amount = fee.amount.GYD;

      if (fee.purpose === "tuition" && amount && amount > 0) {
        gydFees.push(amount);
      }
    }
  }

  if (gydFees.length === 0) {
    return "NA";
  }

  const min = Math.min(...gydFees);
  const max = Math.max(...gydFees);

  return min === max
    ? formatCurrencyAmount(min)
    : `${formatCurrencyAmount(min)}-${formatCurrencyAmount(max)}`;
}

export function SchoolHeader({ orgInstance }: SchoolHeaderProps) {
  const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

  const score = orgInstance.scoringModule
    ? (
        (orgInstance.scoringModule.result.scoreSummary.totalScore /
          orgInstance.scoringModule.result.scoreSummary.maxScore) *
        10
      ).toFixed(1)
    : null;

  const feeRange = computeFeeRange(orgInstance);

  return (
    <div className="w-full md:w-1/3 p-4">
      <div className="flex flex-col gap-4">
        <div
          className="
            flex flex-col items-center text-center gap-3
            sm:flex-row sm:items-center sm:text-left sm:gap-4
          "
        >
          <div className="flex justify-center sm:justify-start sm:shrink-0">
            <Badge
              color="secondary"
              variant="solid"
              content={score}
              size="sm"
              placement="bottom-right"
              shape="circle"
            >
              <Avatar
                src={orgInstance.org.logoPhoto?.url}
                name={orgInstance.org.name}
                size="lg"
                className="h-20 w-20"
                fallback={
                  <span className="text-xs text-default-500">
                    Logo Not Available
                  </span>
                }
              />
            </Badge>
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
              <Chip
                color="default"
                size="sm"
                variant="light"
                className="text-xs gap-1 text-default-500"
                startContent={<DollarSignIcon size={14} />}
              >
                {feeRange}
              </Chip>
              •
              <Chip
                color="default"
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
                as={Link}
                href={`/${orgInstance.org.username}/dashboard`}
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
