import { Button } from "@sovoli/ui/components/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Image } from "@sovoli/ui/components/image";
import { differenceInDays, format, startOfDay } from "date-fns";
import { ProgramPriceCard } from "./ProgramPriceCard";
import { Divider } from "@sovoli/ui/components/divider";

export interface ProgramCycleCardProps {
  orgInstance: OrgInstance;
  cycle: OrgProgramCycle;
}

export function ProgramCycleCard({
  orgInstance,
  cycle,
}: ProgramCycleCardProps) {
  const program = cycle.orgProgram;
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  const whatsapp = orgInstance.org.locations
    .find((l) => l.isPrimary)
    ?.contacts.find((c) => c.type === "whatsapp")?.value;

  // Get cycle information
  const cycleLabel =
    cycle.academicCycle.customLabel ??
    cycle.academicCycle.globalCycle?.label ??
    "Academic Cycle";

  const startDate =
    cycle.academicCycle.startDate ?? cycle.academicCycle.globalCycle?.startDate;
  const endDate =
    cycle.academicCycle.endDate ?? cycle.academicCycle.globalCycle?.endDate;

  // Get pricing information
  const registrationItem = cycle.pricingPackage.pricingItems.find(
    (item) => item.purpose === "registration",
  );
  const tuitionItem = cycle.pricingPackage.pricingItems.find(
    (item) => item.purpose === "tuition",
  );

  // Remove unused getDiscountedAmount function

  // Get age requirements
  const ageReq = cycle.computedRequirements.find((r) => r.type === "age");

  // Format age range display
  const formatAgeRange = (ageRange: {
    minAgeYears?: number;
    maxAgeYears?: number;
  }) => {
    const minAge = ageRange.minAgeYears ?? 0;
    const maxAge = ageRange.maxAgeYears;

    if (maxAge) {
      return `Ages ${minAge}-${maxAge} years`;
    } else {
      return `${minAge} years and up`;
    }
  };

  // Format registration deadline
  const formatRegistrationDeadline = () => {
    if (!cycle.registrationPeriod?.endDate) return null;

    const endDate = new Date(cycle.registrationPeriod.endDate);
    const now = startOfDay(new Date());
    const daysLeft = differenceInDays(endDate, now);

    if (daysLeft < 0) {
      return "Registration closed";
    } else if (daysLeft === 0) {
      return "Registration closes today";
    } else if (daysLeft === 1) {
      return "Registration closes tomorrow";
    } else if (daysLeft <= 7) {
      return `Registration closes in ${daysLeft} days`;
    } else {
      return `Registration closes ${format(endDate, "MMM d, yyyy")}`;
    }
  };

  return (
    <Card className="overflow-hidden shadow-md transition hover:shadow-lg">
      <CardHeader className="flex flex-col gap-2 p-0">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={
              program.image ??
              program.standardProgramVersion?.program.image ??
              ""
            }
            alt={programName}
            className="w-full h-full object-cover"
            removeWrapper
          />
          <div className="absolute bottom-0 left-0 right-0 px-0 pb-0 z-10">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-3 flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">
                {programName}
              </h2>
              {ageReq?.ageRange && (
                <p className="text-foreground-700 text-sm mt-1">
                  {formatAgeRange(ageReq.ageRange)}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <Divider />
      <CardBody className="flex flex-col gap-6">
        {/* 💰 Fees */}
        <div className="space-y-3">
          {tuitionItem && (
            <ProgramPriceCard
              pricingPackage={cycle.pricingPackage}
              pricingItemId={tuitionItem.id}
              size="md"
            />
          )}
        </div>

        {/* 📝 Notes */}
        {cycle.notes && (
          <div className="text-sm text-muted-foreground bg-muted-50 p-2 rounded">
            <span className="font-medium">Note:</span> {cycle.notes}
          </div>
        )}

        {/* 📅 Cycle Dates */}
        {startDate && endDate && (
          <div className="text-sm text-muted-foreground pt-2 border-t border-default-200">
            <div className="flex justify-between">
              <span>📅 {cycleLabel}</span>
              <span>
                {format(new Date(startDate), "MMM d")} -{" "}
                {format(new Date(endDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        )}

        {/* ⏰ Registration Deadline */}
        {formatRegistrationDeadline() && (
          <div className="text-sm text-warning-600 pt-1">
            <span>⏰ {formatRegistrationDeadline()}</span>
          </div>
        )}
      </CardBody>

      {/* 🚨 Footer */}
      <CardFooter className="flex items-center justify-between pt-4">
        <Chip color="warning" variant="light" radius="sm">
          Payment plans available
        </Chip>

        <Button
          as={WhatsAppLink}
          phoneNumber={whatsapp}
          message={`Hi, I'm interested in ${programName} for ${cycleLabel}`}
          color="primary"
          variant="solid"
          radius="sm"
          size="sm"
        >
          Apply Now
        </Button>
      </CardFooter>
      {/* Registration price below the button, smaller */}
      {registrationItem && (
        <div className="px-4 pb-4">
          <ProgramPriceCard
            pricingPackage={cycle.pricingPackage}
            pricingItemId={registrationItem.id}
            size="sm"
          />
        </div>
      )}
    </Card>
  );
}
