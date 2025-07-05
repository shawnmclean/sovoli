import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramCard } from "./ProgramCard";
import { OrgProgramCycle } from "~/modules/academics/types";
import { ProgramCycleCard } from "./ProgramCycleCard";

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
  );
}

function isRegistrationOpen(cycle: OrgProgramCycle, now = new Date()) {
  const period = cycle.registrationPeriod;
  if (!period) return false;
  return new Date(period.startDate) <= now && now <= new Date(period.endDate);
}

function isRegistrationUpcoming(cycle: OrgProgramCycle, now = new Date()) {
  const period = cycle.registrationPeriod;
  if (!period) return false;
  return now < new Date(period.startDate);
}
