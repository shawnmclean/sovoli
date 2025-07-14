import type { OrgProgramCycle } from "~/modules/academics/types";
import type { ProgramLevel } from "~/modules/academics/types";

export interface ProgramSelectionState {
  selectedCycle: OrgProgramCycle | null;
  setSelectedCycle: (cycle: OrgProgramCycle) => void;
  selectedLevel: ProgramLevel | null;
  setSelectedLevel: (level: ProgramLevel) => void;
  isLoading: boolean;
}
