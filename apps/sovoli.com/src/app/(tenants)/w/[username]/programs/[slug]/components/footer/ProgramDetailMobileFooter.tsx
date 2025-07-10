import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ProgramDetailMobileFooterProps {
  orgInstance: OrgInstance;
  program: OrgProgram;
}

export function ProgramDetailMobileFooter({
  orgInstance,
  program,
}: ProgramDetailMobileFooterProps) {
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  return <div>ProgramDetailMobileFooter</div>;
}
