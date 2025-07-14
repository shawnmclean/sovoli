"use client";

import { useState, useEffect } from "react";
import type { OrgProgramCycle } from "~/modules/academics/types";
import { CycleSelector } from "./CycleSelector";

interface CycleSelectionWrapperProps {
  cycles: OrgProgramCycle[];
}

export function CycleSelectionWrapper({ cycles }: CycleSelectionWrapperProps) {
  const [selectedCycle, setSelectedCycle] = useState<OrgProgramCycle | null>(
    null,
  );

  // Set default to the latest cycle
  useEffect(() => {
    if (cycles.length > 0 && !selectedCycle) {
      const latestCycle = cycles[0];
      if (latestCycle) {
        setSelectedCycle(latestCycle);
      }
    }
  }, [cycles, selectedCycle]);

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
