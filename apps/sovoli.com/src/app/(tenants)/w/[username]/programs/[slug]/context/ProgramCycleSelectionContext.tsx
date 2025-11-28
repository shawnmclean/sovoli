"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  startTransition,
} from "react";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import type { ProgramSelectionState } from "./types";

const ProgramSelectionContext = createContext<ProgramSelectionState | null>(
  null,
);

interface ProgramCycleSelectionProviderProps {
  children: ReactNode;
  program: Program;
  defaultCycle?: ProgramCycle;
}

export function ProgramCycleSelectionProvider({
  children,
  program,
  defaultCycle,
}: ProgramCycleSelectionProviderProps) {
  const [selectedCycle, setSelectedCycle] = useState<ProgramCycle | null>(
    defaultCycle ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(!!defaultCycle);
  const isInitializing = useRef(true);

  // Set default cycle on mount if not provided via props
  useEffect(() => {
    if (isInitialized) return; // Already initialized with defaultCycle

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

      const fallbackCycle = currentCycle ?? nextCycle ?? program.cycles[0];
      if (fallbackCycle) {
        startTransition(() => {
          setSelectedCycle(fallbackCycle);
        });
      }
      startTransition(() => {
        setIsInitialized(true);
      });
    } else if (program.cycles?.length === 0) {
      startTransition(() => {
        setIsInitialized(true);
      });
    }
  }, [program.cycles, selectedCycle, isInitialized]);

  // Mark initialization as complete after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitializing.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Wrapper for setSelectedCycle that shows loading during user-initiated changes
  const setSelectedCycleWithLoading = (cycle: ProgramCycle | null) => {
    if (cycle !== selectedCycle) {
      // Only show loading if this is not during initialization
      if (!isInitializing.current) {
        setIsLoading(true);
        // Clear loading after a brief delay to show the transition
        setTimeout(() => setIsLoading(false), 300);
      }
      setSelectedCycle(cycle);
    }
  };

  const value: ProgramSelectionState = {
    selectedCycle,
    setSelectedCycle: setSelectedCycleWithLoading,
    isLoading,
    isInitialized,
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
