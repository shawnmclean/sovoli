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

import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ProgramDetailMobileFooterProps {
  orgInstance: OrgInstance;
  program: OrgProgram;
}

// Helper function to get current date
const getCurrentDate = () => new Date();

// Helper function to check if date is in the future
const isDateInFuture = (dateString: string) => {
  const date = parseISO(dateString);
  return date > getCurrentDate();
};

// Helper function to get cycle status
const getCycleStatus = (startDate: string, endDate: string) => {
  const now = getCurrentDate();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "current";
  return "completed";
};

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

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  const whatsappNumber = orgInstance.org.locations
    .find((l) => l.isPrimary)
    ?.contacts.find((c) => c.type === "whatsapp")?.value;

  // Get cycles for this program
  const programCycles =
    orgInstance.academicModule?.programCycles?.filter(
      (cycle) => cycle.orgProgram.slug === program.slug,
    ) ?? [];

  // Get the next upcoming cycle
  const nextCycle = programCycles
    .filter((cycle) => {
      const startDate =
        cycle.academicCycle.startDate ??
        cycle.academicCycle.globalCycle?.startDate;
      return startDate && isDateInFuture(startDate);
    })
    .sort((a, b) => {
      const aStart =
        a.academicCycle.startDate ??
        a.academicCycle.globalCycle?.startDate ??
        "";
      const bStart =
        b.academicCycle.startDate ??
        b.academicCycle.globalCycle?.startDate ??
        "";
      return parseISO(aStart).getTime() - parseISO(bStart).getTime();
    })[0];

  // Get the current cycle
  const currentCycle = programCycles.find((cycle) => {
    const startDate =
      cycle.academicCycle.startDate ??
      cycle.academicCycle.globalCycle?.startDate;
    const endDate =
      cycle.academicCycle.endDate ?? cycle.academicCycle.globalCycle?.endDate;
    if (!startDate || !endDate) return false;
    return getCycleStatus(startDate, endDate) === "current";
  });

  // Use current cycle if available, otherwise use next cycle
  const activeCycle = currentCycle ?? nextCycle;

  // If no cycles are available, show fallback
  if (!activeCycle) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          <div className="flex flex-1 items-center">July 20 - 10AM</div>
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
              className="font-semibold px-6 border-2 border-transparent [background-image:linear-gradient(hsl(var(--heroui-background)),hsl(var(--heroui-background))),linear-gradient(to_right,rgb(245,65,128),rgb(51,142,247))] [background-origin:border-box] [background-clip:padding-box,border-box] text-foreground"
            >
              Talk To Us
            </Button>
          </div>
        </div>
      </footer>
    );
  }

  // Get cycle information
  const cycleLabel =
    activeCycle.academicCycle.customLabel ??
    activeCycle.academicCycle.globalCycle?.label ??
    "Academic Term";

  const startDate =
    activeCycle.academicCycle.startDate ??
    activeCycle.academicCycle.globalCycle?.startDate;
  const endDate =
    activeCycle.academicCycle.endDate ??
    activeCycle.academicCycle.globalCycle?.endDate;

  const registrationDeadline = activeCycle.registrationPeriod?.endDate;

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
              color="primary"
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
              variant="shadow"
              color="primary"
              radius="lg"
              size="md"
              className="font-semibold px-6 border-2 border-transparent [background-image:linear-gradient(hsl(var(--heroui-background)),hsl(var(--heroui-background))),linear-gradient(to_right,rgb(245,65,128),rgb(51,142,247))] [background-origin:border-box] [background-clip:padding-box,border-box] text-foreground"
            >
              Talk To Us
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
            <div className="space-y-4 p-4">
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
              <div className="pt-4">
                <Button
                  as={WhatsAppLink}
                  phoneNumber={whatsappNumber}
                  message={`Hi, I'm interested in the ${programName} program for ${cycleLabel} (${dateRange}). Can you provide more details about enrollment?`}
                  page="mobile-footer"
                  variant="shadow"
                  color="primary"
                  radius="lg"
                  size="lg"
                  className="font-semibold px-8 w-full border-2 border-transparent [background-image:linear-gradient(hsl(var(--heroui-background)),hsl(var(--heroui-background))),linear-gradient(to_right,rgb(245,65,128),rgb(51,142,247))] [background-origin:border-box] [background-clip:padding-box,border-box] text-foreground"
                  onPress={onOpenChange}
                >
                  Reserve
                </Button>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
