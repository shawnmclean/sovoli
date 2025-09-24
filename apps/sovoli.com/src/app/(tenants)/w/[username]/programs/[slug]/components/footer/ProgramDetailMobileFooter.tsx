"use client";

import { parseISO } from "date-fns";
import { formatCycleLabel } from "~/utils/dateUtils";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";
// import { Link } from "@sovoli/ui/components/link";

import { gradientBorderButton } from "~/components/GradientBorderButton";

import type { Program, ProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon } from "lucide-react";
import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";
import { Skeleton } from "@sovoli/ui/components/skeleton";
// import { GuidedChatForm } from "../GuidedChatForm";
import { getWhatsAppContact } from "~/utils/whatsappUtils";
// import { WhatsAppOTPForm } from "~/app/signin/components/WhatsAppOTPForm";
import { Divider } from "@sovoli/ui/components/divider";
// import { Alert } from "@sovoli/ui/components/alert";
import { LeadsForm } from "../LeadsForm";
import { PriceButton } from "./price/PriceButton";

export interface ProgramDetailMobileFooterProps {
  orgInstance: OrgInstance;
  program: Program;
  defaultCycle?: ProgramCycle;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return date.toLocaleDateString("en-GY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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

  // Get cycle information for contact drawer
  const cycleLabel = selectedCycle
    ? (() => {
        const startDate =
          selectedCycle.academicCycle.startDate ??
          selectedCycle.academicCycle.globalCycle?.startDate ??
          "";
        const endDate =
          selectedCycle.academicCycle.endDate ??
          selectedCycle.academicCycle.globalCycle?.endDate ??
          "";
        return formatCycleLabel(startDate, endDate);
      })()
    : "";

  // If no cycle is selected, show fallback
  if (!selectedCycle) {
    return (
      <>
        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:0] [bottom:max(0px,calc(100dvh-100vh))]">
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

  // Get cycle information for program details
  const startDateForDetails =
    selectedCycle.academicCycle.startDate ??
    selectedCycle.academicCycle.globalCycle?.startDate;
  const endDateForDetails =
    selectedCycle.academicCycle.endDate ??
    selectedCycle.academicCycle.globalCycle?.endDate;

  const registrationDeadline = selectedCycle.registrationPeriod?.endDate;

  // Format date range for program details
  const dateRangeForDetails =
    startDateForDetails && endDateForDetails
      ? `${formatDate(startDateForDetails)} - ${formatDate(endDateForDetails)}`
      : "Dates TBD";

  // Format deadline
  const deadlineText = registrationDeadline
    ? `Deadline: ${formatDate(registrationDeadline)}`
    : "Registration open";

  return (
    <>
      <footer className="fixed left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:0] [bottom:max(0px,calc(100dvh-100vh))]">
        <div className="flex w-full items-center py-3 justify-between">
          {/* Left side - Program info badge */}
          <PriceButton defaultCycle={defaultCycle} />

          {/* Right side - Reserve button */}
          <Button
            variant="shadow"
            radius="lg"
            startContent={<MessageSquareShareIcon size={16} />}
            className={gradientBorderButton()}
            onPress={onOpen}
          >
            Chat Now
          </Button>
        </div>
      </footer>

      {/* Program Details Drawer */}
      <Drawer
        classNames={{
          wrapper: "h-(--visual-viewport-height)",
        }}
        isOpen={isOpen}
        size="5xl"
        placement="bottom"
        backdrop="opaque"
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
              },
            },
            exit: {
              y: 100,
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            },
          },
        }}
      >
        <DrawerContent>
          <DrawerBody className="mt-4">
            <div className="space-y-4 py-4">
              {selectedCycle.status === "closed" ? (
                <div className="flex items-center justify-between">
                  <span className="text-default-600">This Cycle is Closed</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">
                        {cycleLabel}
                      </span>
                      <span className="text-sm text-default-600">
                        {dateRangeForDetails}
                      </span>
                      <span className="text-xs text-default-500">
                        {deadlineText}
                      </span>
                    </div>
                  </div>
                  <Divider />
                  <LeadsForm
                    onSuccess={() => {
                      onOpenChange();
                    }}
                    onError={() => {
                      onOpenChange();
                    }}
                    cycle={selectedCycle}
                    program={program}
                    whatsappNumber={whatsappNumber}
                  />
                </>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
