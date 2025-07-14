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

import { WhatsAppLink } from "~/components/WhatsAppLink";
import { gradientBorderButton } from "~/components/GradientBorderButton";

import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon } from "lucide-react";
import { useProgramSelection } from "../../context/ProgramSelectionContext";

export interface ProgramDetailMobileFooterProps {
  orgInstance: OrgInstance;
  program: OrgProgram;
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
  const { selectedCycle, isLoading } = useProgramSelection();

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  const whatsappNumber = orgInstance.org.locations
    .find((l) => l.isPrimary)
    ?.contacts.find((c) => c.type === "whatsapp")?.value;

  // Show loading state while context is initializing
  if (isLoading) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          <div className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-foreground-600">Loading...</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              as={WhatsAppLink}
              phoneNumber={whatsappNumber}
              message={`Hi, I'm interested in the ${programName} program. Can you provide more details?`}
              intent="Contact"
              page="mobile-footer"
              variant="shadow"
              color="primary"
              radius="lg"
              size="md"
              startContent={<MessageSquareShareIcon size={16} />}
              className={gradientBorderButton()}
            >
              Chat Now
            </Button>
          </div>
        </div>
      </footer>
    );
  }

  // If no cycle is selected, show fallback
  if (!selectedCycle) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          <div className="flex flex-1 items-center">Select a cycle</div>
          <div className="flex-shrink-0">
            <Button
              as={WhatsAppLink}
              phoneNumber={whatsappNumber}
              message={`Hi, I'm interested in the ${programName} program. Can you provide more details?`}
              intent="Contact"
              page="mobile-footer"
              variant="shadow"
              color="primary"
              radius="lg"
              size="md"
              startContent={<MessageSquareShareIcon size={16} />}
              className={gradientBorderButton()}
            >
              Chat Now
            </Button>
          </div>
        </div>
      </footer>
    );
  }

  // Get cycle information
  const cycleLabel =
    selectedCycle.academicCycle.customLabel ??
    selectedCycle.academicCycle.globalCycle?.label ??
    "Academic Term";

  const startDate =
    selectedCycle.academicCycle.startDate ??
    selectedCycle.academicCycle.globalCycle?.startDate;
  const endDate =
    selectedCycle.academicCycle.endDate ??
    selectedCycle.academicCycle.globalCycle?.endDate;

  const registrationDeadline = selectedCycle.registrationPeriod?.endDate;

  // Format date range
  const dateRange =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "Dates TBD";

  // Format deadline
  const deadlineText = registrationDeadline
    ? `Deadline: ${formatDate(registrationDeadline)}`
    : "Registration open";

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          {/* Left side - Program info badge */}
          <div className="flex flex-1 items-center">
            <Button
              as={Link}
              variant="light"
              color="default"
              className="underline"
              onPress={onOpen}
            >
              {cycleLabel}
            </Button>
          </div>

          {/* Right side - Reserve button */}
          <div className="flex-shrink-0">
            <Button
              as={WhatsAppLink}
              phoneNumber={whatsappNumber}
              message={`Hi, I'm interested in the ${programName} program for ${cycleLabel}. Can you provide more details?`}
              page="mobile-footer"
              intent="Contact"
              variant="shadow"
              radius="lg"
              startContent={<MessageSquareShareIcon size={16} />}
              className={gradientBorderButton()}
            >
              Chat Now
            </Button>
          </div>
        </div>
      </footer>

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
              {/* Term Selection */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{cycleLabel}</span>
                  <span className="text-sm text-default-600">{dateRange}</span>
                  <span className="text-xs text-default-500">
                    {deadlineText}
                  </span>
                </div>
                <Button variant="flat" color="default" className="font-medium">
                  Change
                </Button>
              </div>

              {/* WhatsApp Link */}
              <div className="pt-4 flex justify-end">
                <Button
                  as={WhatsAppLink}
                  phoneNumber={whatsappNumber}
                  message={`Hi, I'm interested in the ${programName} program for ${cycleLabel} (${dateRange}). Can you provide more details about enrollment?`}
                  page="mobile-footer"
                  intent="Contact"
                  variant="shadow"
                  radius="lg"
                  className={gradientBorderButton()}
                  onPress={onOpenChange}
                  startContent={<MessageSquareShareIcon size={16} />}
                >
                  Chat Now
                </Button>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
