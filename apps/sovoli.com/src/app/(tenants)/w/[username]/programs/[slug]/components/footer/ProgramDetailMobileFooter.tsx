"use client";

import { parseISO } from "date-fns";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";
import { Link } from "@sovoli/ui/components/link";

import { gradientBorderButton } from "~/components/GradientBorderButton";
import { WhatsAppOTPForm } from "~/app/signin/components/WhatsAppOTPForm";

import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon } from "lucide-react";
import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";
import { Skeleton } from "@sovoli/ui/components/skeleton";
import { GuidedChatForm } from "../GuidedChatForm";
import { getWhatsAppContact } from "~/utils/whatsappUtils";

export interface ProgramDetailMobileFooterProps {
  orgInstance: OrgInstance;
  program: Program;
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
}: ProgramDetailMobileFooterProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isContactOpen,
    onOpen: onContactOpen,
    onOpenChange: onContactOpenChange,
  } = useDisclosure();
  const { selectedCycle, isLoading, isInitialized } =
    useProgramCycleSelection();

  const whatsappNumber = getWhatsAppContact(orgInstance);

  // Get cycle information for contact drawer
  const cycleLabel = selectedCycle
    ? (selectedCycle.academicCycle.customLabel ??
      selectedCycle.academicCycle.globalCycle?.label ??
      "Academic Term")
    : "";

  // If no cycle is selected, show fallback
  if (!selectedCycle) {
    return (
      <>
        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
          <div className="flex w-full items-center justify-between py-3 gap-4">
            <Skeleton isLoaded={!(isLoading && isInitialized)}>
              <div className="flex flex-1 items-center">Select a cycle</div>
            </Skeleton>
            <div className="flex-shrink-0">
              <Button
                variant="shadow"
                color="primary"
                radius="lg"
                size="md"
                startContent={<MessageSquareShareIcon size={16} />}
                className={gradientBorderButton()}
                onPress={onContactOpen}
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
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
        <div className="flex w-full items-start py-3 gap-4">
          {/* Left side - Program info badge */}
          <div className="flex flex-1 items-center min-w-0">
            <Skeleton isLoaded={!(isLoading && isInitialized)}>
              <Button
                as={Link}
                variant="light"
                color="default"
                onPress={onOpen}
                className="text-left h-auto p-2 min-w-0"
              >
                {selectedCycle.status === "closed" ? (
                  <span className="text-default-600">Closed</span>
                ) : (
                  <div className="flex flex-col items-start gap-1 min-w-0 w-full">
                    <span className="underline break-words whitespace-normal text-left">
                      {cycleLabel}
                    </span>
                  </div>
                )}
              </Button>
            </Skeleton>
          </div>

          {/* Right side - Reserve button */}
          <div className="flex-shrink-0 self-center">
            <Button
              variant="shadow"
              radius="lg"
              startContent={<MessageSquareShareIcon size={16} />}
              className={gradientBorderButton()}
              onPress={onContactOpen}
            >
              Chat Now
            </Button>
          </div>
        </div>
      </footer>

      {/* Program Details Drawer */}
      <Drawer
        isOpen={isOpen}
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

                  {/* <WhatsAppOTPForm
                    onSuccess={() => {
                      // Close drawer on success after a short delay
                      setTimeout(() => {
                        onOpenChange();
                      }, 2000);
                    }}
                    onError={(message) => {
                      // Handle error if needed
                      console.error("WhatsApp form error:", message);
                    }}
                  /> */}
                </>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Contact Us Drawer */}

      <GuidedChatForm
        whatsappNumber={whatsappNumber}
        isOpen={isContactOpen}
        onOpenChange={onContactOpenChange}
        cycle={selectedCycle}
        program={program}
      />
    </>
  );
}
