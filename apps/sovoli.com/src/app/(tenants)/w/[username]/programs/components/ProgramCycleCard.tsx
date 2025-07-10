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
import { Image } from "@sovoli/ui/components/image";
import type { OrgProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import {
  ClockIcon,
  ArrowRightIcon,
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
  orgInstance: _orgInstance,
  cycle,
}: ProgramCycleCardProps) {
  const program = cycle.orgProgram;
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

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
      {/* Header Image */}
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-52">
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

          {/* Popular Badge */}
          {program.isPopular && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-background/60 backdrop-blur-sm border border-foreground/20 rounded-full px-3 py-1.5 shadow-lg">
                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                  🔥 Popular
                </span>
              </div>
            </div>
          )}

          {/* Carousel Navigation Buttons */}
          <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/50 hover:bg-background/70 backdrop-blur rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg z-10">
            <ChevronLeftIcon className="w-4 h-4 text-foreground" />
          </button>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/50 hover:bg-background/70 backdrop-blur rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg z-10">
            <ChevronRightIcon className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </CardHeader>

      <Divider />

      {/* Body */}
      <CardBody className="flex flex-col gap-4 pb-4">
        {/* Program Title */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            {programName}
          </h2>
          {program.tagline && (
            <p className="text-sm text-foreground-500">{program.tagline}</p>
          )}
        </div>

        {/* Essential Details */}
        <div className="flex flex-col gap-2 text-sm text-foreground-500">
          {/* Term Date and Age Range */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>
                {cycle.academicCycle.customLabel ??
                  cycle.academicCycle.globalCycle?.label ??
                  "Academic Term"}
              </span>
            </div>
            {ageReq?.ageRange && (
              <div className="flex items-center gap-1 text-xs">
                <UserIcon className="w-3 h-3" />
                <span>{formatAgeRange(ageReq.ageRange)}</span>
              </div>
            )}
          </div>
          {formatRegistrationDeadline() && (
            <div className="flex items-center gap-2 font-semibold text-destructive">
              <ClockIcon className="w-4 h-4" />
              <span>{formatRegistrationDeadline()}</span>
            </div>
          )}
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
          startContent={<ArrowRightIcon className="w-5 h-5" />}
        >
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}
