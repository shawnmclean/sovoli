"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import type { ProgramSelectionState } from "./types";

const ProgramSelectionContext = createContext<ProgramSelectionState | null>(
  null,
);

interface ProgramCycleSelectionProviderProps {
  children: ReactNode;
  program: Program;
}

export function ProgramCycleSelectionProvider({
  children,
  program,
}: ProgramCycleSelectionProviderProps) {
  const [selectedCycle, setSelectedCycle] = useState<ProgramCycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set default cycle on mount or when cycles change
  useEffect(() => {
    if (program.cycles && program.cycles.length > 0 && !selectedCycle) {
      // Find current cycle first, then next cycle, then first available
      const currentCycle = program.cycles.find((cycle) => {
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

      const nextCycle = program.cycles.find((cycle) => {
        const startDate =
          cycle.academicCycle.startDate ??
          cycle.academicCycle.globalCycle?.startDate;
        return startDate && new Date(startDate) > new Date();
      });

      const defaultCycle = currentCycle ?? nextCycle ?? program.cycles[0];
      if (defaultCycle) {
        setSelectedCycle(defaultCycle);
      }
      setIsLoading(false);
    } else if (program.cycles && program.cycles.length === 0) {
      setIsLoading(false);
    }
  }, [program.cycles, selectedCycle]);

  const value: ProgramSelectionState = {
    selectedCycle,
    setSelectedCycle,
    isLoading,
  };

  return (
    <ProgramSelectionContext.Provider value={value}>
      {children}
    </ProgramSelectionContext.Provider>
  );
}

export function useProgramCycleSelection() {
  const context = useContext(ProgramSelectionContext);
  if (!context) {
    throw new Error(
      "useProgramCycleSelection must be used within a ProgramCycleSelectionProvider",
    );
  }
  return context;
}
