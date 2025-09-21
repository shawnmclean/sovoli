"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";

import { Link } from "@sovoli/ui/components/link";
import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import {
  ClockIcon,
  ArrowRightIcon,
  UserIcon,
  GraduationCapIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatCycleLabel } from "~/utils/dateUtils";
import { ProgramCarousel } from "./ProgramCarousel";

export interface ProgramCycleCardProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function ProgramCycleCard({
  orgInstance: _orgInstance,
  program,
}: ProgramCycleCardProps) {
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  const admission =
    program.admission ?? program.standardProgramVersion?.admission;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const ageReq = admission?.eligibility.find((r) => r.type === "age");

  const formatAgeRange = (range: {
    minAgeYears?: number;
    maxAgeYears?: number;
  }) => {
    const min = range.minAgeYears ?? 0;
    return range.maxAgeYears
      ? `Ages ${min}-${range.maxAgeYears}`
      : `Ages ${min} and up`;
  };

  const currentCycle = program.cycles?.[0];

  const formatTermInfo = () => {
    if (!currentCycle) return "Join the Academic Term";

    const startDate =
      currentCycle.academicCycle.startDate ??
      currentCycle.academicCycle.globalCycle?.startDate ??
      "";
    const endDate =
      currentCycle.academicCycle.endDate ??
      currentCycle.academicCycle.globalCycle?.endDate ??
      "";

    const termLabel = formatCycleLabel(startDate, endDate);

    if (!currentCycle.registrationPeriod?.endDate) {
      return `Join the ${termLabel}`;
    }

    const end = parseISO(currentCycle.registrationPeriod.endDate);
    const deadline = format(end, "MMM d");
    return `${termLabel} term - Apply by ${deadline}`;
  };

  return (
    <Card className="overflow-hidden shadow-sm transition hover:shadow-lg cursor-pointer group">
      {/* Header Image */}
      <CardHeader className="p-0 relative">
        <div className="relative w-full min-h-[300px] overflow-hidden">
          <div className="w-full h-full">
            <ProgramCarousel
              program={program}
              href={`/programs/${program.slug}`}
            />
          </div>

          {/* Popular Badge */}
          {program.isPopular && (
            <Link
              href={`/programs/${program.slug}`}
              className="absolute top-3 left-3 z-20"
            >
              <div className="bg-background/60 backdrop-blur-sm border border-foreground/20 rounded-full px-3 py-1.5 shadow-lg">
                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                  🔥 Popular
                </span>
              </div>
            </Link>
          )}
        </div>
      </CardHeader>

      {/* Body */}
      <CardBody>
        <Link
          href={`/programs/${program.slug}`}
          className="flex flex-col gap-4 items-start"
        >
          <div className="flex flex-col gap-2 text-foreground-500 w-full">
            <h2 className="text-xl font-bold text-foreground">{programName}</h2>
            {program.tagline && (
              <p className="text-foreground-500 mb-1">{program.tagline}</p>
            )}
            {/* Age Range */}
            {ageReq?.ageRange && (
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{formatAgeRange(ageReq.ageRange)}</span>
              </div>
            )}
            {program.outcome && (
              <div className="flex items-center gap-2">
                <GraduationCapIcon className="w-4 h-4" />
                <span>{program.outcome}</span>
              </div>
            )}
            {/* Term Info */}
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span className="font-medium">{formatTermInfo()}</span>
            </div>
          </div>
          <div className="flex w-full justify-end">
            <div className="flex items-center gap-1 text-sm text-foreground-500 group-hover:text-foreground transition-colors">
              <span>Learn more</span>
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </CardBody>
    </Card>
  );
}
