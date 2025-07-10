"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Link } from "@sovoli/ui/components/link";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { Image } from "@sovoli/ui/components/image";
import type { OrgProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import {
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  SendIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { differenceInDays, format, startOfDay, parseISO } from "date-fns";

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

  const cycleLabel =
    cycle.academicCycle.customLabel ?? cycle.academicCycle.globalCycle?.label;

  const startDate =
    cycle.academicCycle.startDate ?? cycle.academicCycle.globalCycle?.startDate;
  const endDate =
    cycle.academicCycle.endDate ?? cycle.academicCycle.globalCycle?.endDate;

  const ageReq = cycle.computedRequirements.find((r) => r.type === "age");
  const formatAgeRange = (range: {
    minAgeYears?: number;
    maxAgeYears?: number;
  }) => {
    const min = range.minAgeYears ?? 0;
    return range.maxAgeYears
      ? `Ages ${min}-${range.maxAgeYears} years`
      : `${min} years and up`;
  };

  const formatRegistrationDeadline = () => {
    if (!cycle.registrationPeriod?.endDate) return null;
    const end = parseISO(cycle.registrationPeriod.endDate);
    const now = startOfDay(new Date());
    const days = differenceInDays(end, now);
    if (days < 0) return "Registration closed";
    if (days === 0) return "Registration closes today";
    if (days === 1) return "Registration closes tomorrow";
    if (days <= 7) return `Registration closes in ${days} days`;
    return `Registration closes ${format(end, "MMM d, yyyy")}`;
  };

  return (
    <Card className="overflow-hidden shadow transition hover:shadow-lg">
      {/* Header Image + Title */}
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
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

          {/* Carousel Navigation Buttons */}
          <button className="absolute left-2 top-1/3 -translate-y-1/2 w-8 h-8 bg-background/50 hover:bg-background/70 backdrop-blur rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg z-10">
            <ChevronLeftIcon className="w-4 h-4 text-foreground" />
          </button>
          <button className="absolute right-2 top-1/3 -translate-y-1/2 w-8 h-8 bg-background/50 hover:bg-background/70 backdrop-blur rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg z-10">
            <ChevronRightIcon className="w-4 h-4 text-foreground" />
          </button>

          <div className="absolute inset-x-0 bottom-0 bg-background/70 backdrop-blur py-2 px-4 z-10">
            <h2 className="text-lg font-bold text-foreground">{programName}</h2>
            {program.tagline && (
              <p className="text-sm text-foreground-500 mt-1">
                {program.tagline}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <Divider />

      {/* Body */}
      <CardBody className="flex flex-col gap-4 pb-4">
        {/* Essential Details */}
        <div className="flex flex-col gap-2 text-sm text-foreground-500">
          {ageReq?.ageRange && (
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>{formatAgeRange(ageReq.ageRange)}</span>
            </div>
          )}
          {startDate && endDate && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {format(parseISO(startDate), "MMM d")}–
                {format(parseISO(endDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
          {formatRegistrationDeadline() && (
            <div className="flex items-center gap-2 font-semibold text-destructive">
              <ClockIcon className="w-4 h-4" />
              <span>{formatRegistrationDeadline()}</span>
            </div>
          )}
        </div>

        {/* Program Description */}
        <div className="text-sm text-foreground-600">
          <p>
            {program.description ??
              program.standardProgramVersion?.program.description ??
              "A comprehensive learning experience designed to foster growth and development."}
          </p>
        </div>
      </CardBody>

      {/* Footer Actions */}
      <CardFooter className="flex flex-col items-center gap-3 pt-0">
        <Button
          as={Link}
          href={`/programs/${program.slug}`}
          fullWidth
          color="primary"
          variant="solid"
          radius="md"
          size="lg"
          startContent={<InfoIcon />}
        >
          View Program Details
        </Button>

        <Button
          as={WhatsAppLink}
          phoneNumber={whatsapp}
          message={`Hi, I'm interested in ${programName} (${cycleLabel}). Can you tell me more about pricing and availability?`}
          fullWidth
          color="default"
          variant="bordered"
          radius="md"
          size="md"
          startContent={<SendIcon />}
        >
          Ask About Pricing
        </Button>

        <p className="text-xs text-foreground-500 text-center">
          📸 Real Classrooms &middot; 📚 Books &middot; 📖 Learning
        </p>
      </CardFooter>
    </Card>
  );
}
