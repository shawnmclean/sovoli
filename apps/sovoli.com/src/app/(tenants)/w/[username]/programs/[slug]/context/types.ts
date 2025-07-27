import type { ProgramCycle } from "~/modules/academics/types";

export interface ProgramSelectionState {
  selectedCycle: ProgramCycle | null;
  setSelectedCycle: (cycle: ProgramCycle | null) => void;
  isLoading: boolean;
  isInitialized: boolean;
}
