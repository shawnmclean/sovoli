"use client";

import { useProgramSelection } from "../context/ProgramSelectionContext";
import { CycleSelector } from "./CycleSelector";
import type { OrgProgramCycle } from "~/modules/academics/types";

interface CycleSelectionWrapperProps {
  cycles: OrgProgramCycle[];
}

export function CycleSelectionWrapper({ cycles }: CycleSelectionWrapperProps) {
  const { selectedCycle, setSelectedCycle } = useProgramSelection();

  const handleCycleChange = (cycle: OrgProgramCycle) => {
    setSelectedCycle(cycle);
  };

  if (cycles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Cycle Selector */}
      <CycleSelector
        cycles={cycles}
        onCycleChange={handleCycleChange}
        selectedCycle={selectedCycle ?? undefined}
      />
    </div>
  );
}
