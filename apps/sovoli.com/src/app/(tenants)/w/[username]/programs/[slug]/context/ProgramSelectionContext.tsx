"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { OrgProgramCycle } from "~/modules/academics/types";
import type { ProgramSelectionState } from "./types";
import type { ProgramLevel } from "~/modules/academics/types";

const ProgramSelectionContext = createContext<ProgramSelectionState | null>(
  null,
);

interface ProgramSelectionProviderProps {
  children: ReactNode;
  cycles: OrgProgramCycle[];
}

export function ProgramSelectionProvider({
  children,
  cycles,
}: ProgramSelectionProviderProps) {
  const [selectedCycle, setSelectedCycle] = useState<OrgProgramCycle | null>(
    null,
  );
  const [selectedLevel, setSelectedLevel] = useState<ProgramLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set default cycle on mount or when cycles change
  useEffect(() => {
    if (cycles.length > 0 && !selectedCycle) {
      // Find current cycle first, then next cycle, then first available
      const currentCycle = cycles.find((cycle) => {
        const startDate =
          cycle.academicCycle.startDate ??
          cycle.academicCycle.globalCycle?.startDate;
        const endDate =
          cycle.academicCycle.endDate ??
          cycle.academicCycle.globalCycle?.endDate;
        if (!startDate || !endDate) return false;

        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        return now >= start && now <= end;
      });

      const nextCycle = cycles.find((cycle) => {
        const startDate =
          cycle.academicCycle.startDate ??
          cycle.academicCycle.globalCycle?.startDate;
        return startDate && new Date(startDate) > new Date();
      });

      const defaultCycle = currentCycle ?? nextCycle ?? cycles[0];
      if (defaultCycle) {
        setSelectedCycle(defaultCycle);
      }
      setIsLoading(false);
    } else if (cycles.length === 0) {
      setIsLoading(false);
    }
  }, [cycles, selectedCycle]);

  const value: ProgramSelectionState = {
    selectedCycle,
    setSelectedCycle,
    selectedLevel,
    setSelectedLevel,
    isLoading,
  };

  return (
    <ProgramSelectionContext.Provider value={value}>
      {children}
    </ProgramSelectionContext.Provider>
  );
}

export function useProgramSelection() {
  const context = useContext(ProgramSelectionContext);
  if (!context) {
    throw new Error(
      "useProgramSelection must be used within a ProgramSelectionProvider",
    );
  }
  return context;
}
