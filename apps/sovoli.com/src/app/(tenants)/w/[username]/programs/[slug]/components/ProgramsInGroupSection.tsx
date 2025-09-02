import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Link } from "@sovoli/ui/components/link";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";

export interface ProgramsInGroupSectionProps {
  orgInstance: OrgInstance;
  program: Program;
}

const getProgramName = (program: Program) => {
  return (
    program.name ?? program.standardProgramVersion?.program.name ?? "Program"
  );
};

export const ProgramsInGroupSection = ({
  orgInstance,
  program,
}: ProgramsInGroupSectionProps) => {
  const group = program.group ?? program.standardProgramVersion?.program.group;
  if (!group) {
    return null;
  }

  // Get all programs in the same group from the orgInstance
  const programsInGroup =
    orgInstance.academicModule?.programs.filter(
      (p) =>
        p.group?.id === group.id ||
        p.standardProgramVersion?.program.group?.id === group.id,
    ) ?? [];

  if (programsInGroup.length <= 1) {
    return null;
  }

  return (
    <ProgramSectionsWrapper program={program} section="programs_in_group">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            All programs in {group.name}
          </h2>
        </div>

        {/* Programs List */}
        <div className="space-y-2">
          {programsInGroup.map((p, index) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="text-sm text-default-500 min-w-[20px]">
                {index + 1}.
              </span>
              <Link
                href={`/programs/${p.slug}`}
                color={p.id === program.id ? "primary" : "foreground"}
                underline="hover"
                className={p.id === program.id ? "font-medium" : ""}
              >
                {getProgramName(p)}
                {p.id === program.id && " (this one)"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </ProgramSectionsWrapper>
  );
};
