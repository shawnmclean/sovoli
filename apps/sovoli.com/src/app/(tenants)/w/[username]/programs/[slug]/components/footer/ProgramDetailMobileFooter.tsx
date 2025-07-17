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
import { ReserveForm } from "../ReserveForm";

import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon } from "lucide-react";
import { useProgramSelection } from "../../context/ProgramSelectionContext";
import { Skeleton } from "@sovoli/ui/components/skeleton";
import posthog from "posthog-js";

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
  const {
    isOpen: isContactOpen,
    onOpen: onContactOpen,
    onOpenChange: onContactOpenChange,
  } = useDisclosure();
  const { selectedCycle, selectedLevel, isLoading } = useProgramSelection();

  const whatsappNumber = orgInstance.org.locations
    .find((l) => l.isPrimary)
    ?.contacts.find((c) => c.type === "whatsapp")?.value;

  // Get cycle information for contact drawer
  const cycleLabel = selectedCycle
    ? (selectedCycle.academicCycle.customLabel ??
      selectedCycle.academicCycle.globalCycle?.label ??
      "Academic Term")
    : "";

  const onChatNow = () => {
    posthog.capture("chat_now_clicked", {
      program_name: program.name,
      cycle_label: cycleLabel,
      level_label: selectedLevel?.label,
    });
    onContactOpen();
  };

  // If no cycle is selected, show fallback
  if (!selectedCycle) {
    return (
      <>
        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
          <div className="flex w-full items-center justify-between py-3 gap-4">
            <Skeleton isLoaded={!isLoading}>
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
                onPress={onChatNow}
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
        <div className="flex w-full items-center justify-between py-3 gap-4">
          {/* Left side - Program info badge */}
          <div className="flex flex-1 items-center">
            <Skeleton isLoaded={!isLoading}>
              <Button
                as={Link}
                variant="light"
                color="default"
                onPress={onOpen}
              >
                {selectedCycle.status === "closed" ? (
                  <span className="text-default-600">Closed</span>
                ) : (
                  <div className="flex flex-col items-start gap-1">
                    <span className="underline">{cycleLabel}</span>
                    {selectedLevel && (
                      <span className="text-xs text-default-600">
                        {selectedLevel.label}
                      </span>
                    )}
                  </div>
                )}
              </Button>
            </Skeleton>
          </div>

          {/* Right side - Reserve button */}
          <div className="flex-shrink-0">
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
                      {selectedLevel && (
                        <span className="text-sm text-default-600">
                          {selectedLevel.label}
                        </span>
                      )}
                      <span className="text-sm text-default-600">
                        {dateRangeForDetails}
                      </span>
                      <span className="text-xs text-default-500">
                        {deadlineText}
                      </span>
                    </div>
                    <Button
                      variant="flat"
                      color="default"
                      className="font-medium"
                    >
                      Change
                    </Button>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="shadow"
                      radius="lg"
                      className={gradientBorderButton()}
                      onPress={onContactOpen}
                      startContent={<MessageSquareShareIcon size={16} />}
                    >
                      Chat Now
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Contact Us Drawer */}
      <Drawer
        isOpen={isContactOpen}
        placement="bottom"
        backdrop="opaque"
        size="full"
        scrollBehavior="inside"
        onOpenChange={onContactOpenChange}
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
          <DrawerBody className="p-2">
            <ReserveForm
              whatsappNumber={whatsappNumber}
              onClose={onContactOpenChange}
              program={program}
              cycle={cycleLabel}
              level={selectedLevel?.label}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
