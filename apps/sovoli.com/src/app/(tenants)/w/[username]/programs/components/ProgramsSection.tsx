import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramCard } from "./ProgramCard";
import type { OrgProgramCycle } from "~/modules/academics/types";
import { ProgramCycleCard } from "./ProgramCycleCard";
import { Alert } from "@sovoli/ui/components/alert";
import { Check } from "lucide-react";
import { parseISO } from "date-fns";

export interface ProgramsSectionProps {
  orgInstance: OrgInstance;
}

export function ProgramsSection({ orgInstance }: ProgramsSectionProps) {
  const programs = orgInstance.academicModule?.programs ?? [];
  const programCycles = orgInstance.academicModule?.programCycles ?? [];

  const now = new Date();

  // Group cycles
  const openCycles: OrgProgramCycle[] = [];
  const upcomingCycles: OrgProgramCycle[] = [];

  for (const cycle of programCycles) {
    if (isRegistrationOpen(cycle, now)) {
      openCycles.push(cycle);
    } else if (isRegistrationUpcoming(cycle, now)) {
      upcomingCycles.push(cycle);
    }
  }

  // Get set of programs already shown via open/upcoming cycles
  const shownProgramIds = new Set(
    [...openCycles, ...upcomingCycles].map((c) => c.orgProgram.slug),
  );

  // Get remaining programs with no open or upcoming cycle
  const otherPrograms = programs.filter((p) => !shownProgramIds.has(p.slug));

  return (
    <>
      <Alert
        color="warning"
        variant="flat"
        hideIcon
        title="Payment Options"
        description={
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-foreground-500">
                Flexible payment options available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-foreground-500">
                Family discounts available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span className="text-foreground-500">MMG coming soon!</span>
            </div>
          </div>
        }
      />
      <div className="space-y-12">
        {/* Section 1: Current Registration */}
        {openCycles.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2">
            {openCycles.map((cycle) => (
              <ProgramCycleCard
                key={cycle.id}
                orgInstance={orgInstance}
                cycle={cycle}
              />
            ))}
          </div>
        )}

        {/* Section 2: Upcoming Registration */}
        {upcomingCycles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Upcoming Programs</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {upcomingCycles.map((cycle) => (
                <ProgramCycleCard
                  key={cycle.id}
                  orgInstance={orgInstance}
                  cycle={cycle}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Static Programs */}
        {otherPrograms.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Other Programs</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {otherPrograms.map((program) => (
                <ProgramCard
                  key={program.slug}
                  orgInstance={orgInstance}
                  program={program}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function isRegistrationOpen(cycle: OrgProgramCycle, now = new Date()) {
  const period = cycle.registrationPeriod;
  if (!period) return false;
  return parseISO(period.startDate) <= now && now <= parseISO(period.endDate);
}

function isRegistrationUpcoming(cycle: OrgProgramCycle, now = new Date()) {
  const period = cycle.registrationPeriod;
  if (!period) return false;
  return now < parseISO(period.startDate);
}
