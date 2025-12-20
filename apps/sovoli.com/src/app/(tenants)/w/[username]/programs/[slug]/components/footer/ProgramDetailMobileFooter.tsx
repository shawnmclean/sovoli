"use client";

import { Button } from "@sovoli/ui/components/button";
import Link from "next/link";

import { gradientBorderButton } from "~/components/GradientBorderButton";

import type { Program, ProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { UserPlus } from "lucide-react";
import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";
import { Skeleton } from "@sovoli/ui/components/skeleton";
import { PriceButton } from "../price/PriceButton";

export interface ProgramDetailMobileFooterProps {
  orgInstance: OrgInstance;
  program: Program;
  defaultCycle?: ProgramCycle;
}

export function ProgramDetailMobileFooter({
  orgInstance: _orgInstance,
  program,
  defaultCycle,
}: ProgramDetailMobileFooterProps) {
  const { selectedCycle, isLoading, isInitialized } =
    useProgramCycleSelection();

  // If no cycle is selected, show fallback
  if (!selectedCycle) {
    return (
      <footer className="fixed left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          <Skeleton isLoaded={!(isLoading && isInitialized)}>
            <div className="flex flex-1 items-center">Select a cycle</div>
          </Skeleton>
          <div className="shrink-0">
            <Button
              as={Link}
              href={`/programs/${program.slug}/enroll`}
              variant="shadow"
              color="primary"
              radius="full"
              size="md"
              startContent={<UserPlus size={16} />}
              className={gradientBorderButton()}
            >
              Enroll
            </Button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="fixed left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
      <div className="flex w-full items-center py-3 justify-between">
        {/* Left side - Program info badge */}
        <PriceButton defaultCycle={defaultCycle} program={program} />

        {/* Right side - Enroll button */}
        <Button
          as={Link}
          href={`/programs/${program.slug}/enroll`}
          variant="shadow"
          color="primary"
          radius="full"
          size="md"
          startContent={<UserPlus size={16} />}
          className={gradientBorderButton()}
        >
          Enroll
        </Button>
      </div>
    </footer>
  );
}
