"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
// import { Link } from "@sovoli/ui/components/link";

import { gradientBorderButton } from "~/components/GradientBorderButton";

import type { Program, ProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon } from "lucide-react";
import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";
import { Skeleton } from "@sovoli/ui/components/skeleton";
import { getWhatsAppContact } from "~/utils/whatsappUtils";
import { PriceButton } from "./price/PriceButton";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import { Link } from "@sovoli/ui/components/link";

export interface ProgramDetailMobileFooterProps {
  orgInstance: OrgInstance;
  program: Program;
  defaultCycle?: ProgramCycle;
}

export function ProgramDetailMobileFooter({
  orgInstance,
  program,
  defaultCycle,
}: ProgramDetailMobileFooterProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const {
  //   isOpen: isContactOpen,
  //   onOpen: onContactOpen,
  //   onOpenChange: onContactOpenChange,
  // } = useDisclosure();
  const { selectedCycle, isLoading, isInitialized } =
    useProgramCycleSelection();

  const whatsappNumber = getWhatsAppContact(orgInstance);

  // If no cycle is selected, show fallback
  if (!selectedCycle) {
    return (
      <>
        <footer className="fixed left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
          <div className="flex w-full items-center justify-between py-3 gap-4">
            <Skeleton isLoaded={!(isLoading && isInitialized)}>
              <div className="flex flex-1 items-center">Select a cycle</div>
            </Skeleton>
            <div className="shrink-0">
              <Button
                variant="shadow"
                color="primary"
                radius="lg"
                size="md"
                startContent={<MessageSquareShareIcon size={16} />}
                className={gradientBorderButton()}
                onPress={onOpen}
              >
                Chat Now
              </Button>
            </div>
          </div>
        </footer>
      </>
    );
  }

  return (
    <>
      <footer className="fixed left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
        <div className="flex w-full items-center py-3 justify-between">
          {/* Left side - Program info badge */}
          <PriceButton defaultCycle={defaultCycle} />

          {/* Right side - Reserve button */}
          <Button
            as={Link}
            variant="shadow"
            radius="lg"
            startContent={<MessageSquareShareIcon size={16} />}
            className={gradientBorderButton()}
            href="/chat"
          >
            Chat Now
          </Button>
        </div>
      </footer>

      {/* Signup Dialog */}
      <SignupDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        mode="lead"
        cycle={selectedCycle}
        program={program}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
