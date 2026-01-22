import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramCard } from "./ProgramCard";
import { ProgramCycleCard } from "./ProgramCycleCard";

export interface ProgramsSectionProps {
  orgInstance: OrgInstance;
}

export function ProgramsSection({ orgInstance }: ProgramsSectionProps) {
  const programs = orgInstance.academicModule?.programs ?? [];

  return (
    <div className="space-y-12">
      {programs.map((program) => {
        if (program.cycles?.length === 0) {
          return (
            <ProgramCard
              key={program.slug}
              orgInstance={orgInstance}
              program={program}
            />
          );
        }

        return (
          <ProgramCycleCard
            key={program.slug}
            program={program}
            orgInstance={orgInstance}
          />
        );
      })}
    </div>
  );
}
