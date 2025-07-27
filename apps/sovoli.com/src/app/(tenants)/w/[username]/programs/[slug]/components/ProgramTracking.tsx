"use client";

import { useEffect } from "react";
import { useProgramCycleSelection } from "../context/ProgramCycleSelectionContext";
import { trackProgramAnalytics } from "../lib/programAnalytics";

import type { ProgramCycle, Program } from "~/modules/academics/types";

interface ProgramTrackingProps {
  program: Program;
  defaultCycle?: ProgramCycle | null;
}

export function ProgramTracking({
  program,
  defaultCycle,
}: ProgramTrackingProps) {
  const { selectedCycle } = useProgramCycleSelection();

  // Track initial load with defaults
  useEffect(() => {
    trackProgramAnalytics("ViewContent", program, defaultCycle);
  }, [defaultCycle, program]);

  // Track when selections change from defaults
  useEffect(() => {
    if (!selectedCycle) return;

    // Only track if the cycle label has changed
    if (defaultCycle?.id !== selectedCycle.id) {
      trackProgramAnalytics("ViewContent", program, selectedCycle);
    }
  }, [selectedCycle, defaultCycle, program]);

  return null; // This component doesn't render anything
}
