import type { ProgramCycle } from "~/modules/academics/types";

export interface ProgramSelectionState {
  selectedCycle: ProgramCycle | null;
  setSelectedCycle: (cycle: ProgramCycle) => void;
  isLoading: boolean;
}
