import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Image } from "@sovoli/ui/components/image";
import { differenceInDays, format, startOfDay } from "date-fns";

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

  // Helper function to get discounted amount (following PlanCard pattern)
  const getDiscountedAmount = (
    item: { id: string; amount: { GYD?: number; USD?: number } },
    currency: "GYD" | "USD",
  ): number => {
    const base = item.amount[currency] ?? 0;
    const now = new Date().toISOString();

    // Check for item-specific discounts
    const activeDiscount = cycle.pricingPackage.discounts?.find(
      (d) =>
        d.type === "percentage" &&
        d.appliesTo.includes(item.id) &&
        (!d.validFrom || d.validFrom <= now) &&
        (!d.validUntil || d.validUntil >= now),
    );

    if (activeDiscount) {
      return base * (1 - activeDiscount.value / 100);
    }

    return base;
  };

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
      {/* 🖼️ Image */}
      <Image
        src={
          program.image ?? program.standardProgramVersion?.program.image ?? ""
        }
        alt={programName}
        width={800}
        height={150}
        className="h-48 w-full object-cover"
      />

      <CardBody className="flex flex-col space-y-3">
        {/* 📛 Title + Description */}
        <div>
          <h3 className="text-2xl font-semibold text-primary-800">
            {programName}
          </h3>
          <p className="text-base leading-relaxed text-foreground-600">
            {program.description ??
              program.standardProgramVersion?.program.description ??
              "A great learning foundation in a nurturing space."}
          </p>
        </div>

        {/* 🎯 Age Range */}
        {ageReq?.ageRange && (
          <Chip color="default" variant="light">
            {formatAgeRange(ageReq.ageRange)}
          </Chip>
        )}

        {/* 💰 Fees */}
        <div className="space-y-1 text-sm">
          {registrationItem && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registration:</span>
              <span>
                {(() => {
                  const gydOriginal = registrationItem.amount.GYD;
                  const usdOriginal = registrationItem.amount.USD;
                  const gydDiscounted = getDiscountedAmount(
                    registrationItem,
                    "GYD",
                  );
                  const usdDiscounted = getDiscountedAmount(
                    registrationItem,
                    "USD",
                  );

                  if (gydOriginal && gydDiscounted < gydOriginal) {
                    return (
                      <>
                        <span className="line-through text-red-400 mr-1">
                          GYD {gydOriginal.toLocaleString()}
                        </span>
                        <span className="font-semibold text-white">
                          GYD {gydDiscounted.toLocaleString()}
                        </span>
                      </>
                    );
                  } else if (usdOriginal && usdDiscounted < usdOriginal) {
                    return (
                      <>
                        <span className="line-through text-red-400 mr-1">
                          USD {usdOriginal.toLocaleString()}
                        </span>
                        <span className="font-semibold text-white">
                          USD {usdDiscounted.toLocaleString()}
                        </span>
                      </>
                    );
                  } else if (gydOriginal) {
                    return (
                      <span className="font-semibold text-white">
                        GYD {gydOriginal.toLocaleString()}
                      </span>
                    );
                  } else if (usdOriginal) {
                    return (
                      <span className="font-semibold text-white">
                        USD {usdOriginal.toLocaleString()}
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-muted-foreground">
                        Contact for pricing
                      </span>
                    );
                  }
                })()}
              </span>
            </div>
          )}
          {tuitionItem && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tuition:</span>
              <span>
                {(() => {
                  const gydOriginal = tuitionItem.amount.GYD;
                  const usdOriginal = tuitionItem.amount.USD;
                  const gydDiscounted = getDiscountedAmount(tuitionItem, "GYD");
                  const usdDiscounted = getDiscountedAmount(tuitionItem, "USD");

                  if (gydOriginal && gydDiscounted < gydOriginal) {
                    return (
                      <>
                        <span className="line-through text-red-400 mr-1">
                          GYD {gydOriginal.toLocaleString()}
                        </span>
                        <span className="font-semibold text-white">
                          GYD {gydDiscounted.toLocaleString()}
                        </span>
                      </>
                    );
                  } else if (usdOriginal && usdDiscounted < usdOriginal) {
                    return (
                      <>
                        <span className="line-through text-red-400 mr-1">
                          USD {usdOriginal.toLocaleString()}
                        </span>
                        <span className="font-semibold text-white">
                          USD {usdDiscounted.toLocaleString()}
                        </span>
                      </>
                    );
                  } else if (gydOriginal) {
                    return (
                      <span className="font-semibold text-white">
                        GYD {gydOriginal.toLocaleString()}
                      </span>
                    );
                  } else if (usdOriginal) {
                    return (
                      <span className="font-semibold text-white">
                        USD {usdOriginal.toLocaleString()}
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-muted-foreground">
                        Contact for pricing
                      </span>
                    );
                  }
                })()}
              </span>
            </div>
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
    </Card>
  );
}
