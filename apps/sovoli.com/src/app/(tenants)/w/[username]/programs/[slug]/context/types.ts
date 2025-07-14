import type { OrgProgramCycle } from "~/modules/academics/types";

export interface ProgramSelectionState {
  selectedCycle: OrgProgramCycle | null;
  setSelectedCycle: (cycle: OrgProgramCycle) => void;
  isLoading: boolean;
}
