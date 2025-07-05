import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramCard } from "./ProgramCard";

export interface ProgramsSectionProps {
  orgInstance: OrgInstance;
}

export function ProgramsSection({ orgInstance }: ProgramsSectionProps) {
  const programs = orgInstance.academicModule?.programs ?? [];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {programs.map((program, index) => (
        <ProgramCard key={index} orgInstance={orgInstance} program={program} />
      ))}
    </div>
  );
}
