"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { useProgramCycleSelection } from "../context/ProgramCycleSelectionContext";

import type { ProgramCycle, Program } from "~/modules/academics/types";

interface ProgramTrackingProps {
  program: Program;
  defaultCycle?: ProgramCycle | null;
}

export function ProgramTracking({
  program,
  defaultCycle,
}: ProgramTrackingProps) {
  const posthog = usePostHog();
  const { selectedCycle } = useProgramCycleSelection();

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "Program";
  // Track initial load with defaults
  useEffect(() => {
    if (!defaultCycle) return;

    const defaultCycleLabel =
      defaultCycle.academicCycle.customLabel ??
      defaultCycle.academicCycle.globalCycle?.label ??
      "Academic Term";

    posthog.capture("ViewContent", {
      program: programName,
      cycle: defaultCycleLabel,
    });
  }, [defaultCycle, programName, posthog]);

  // Track when selections change from defaults
  useEffect(() => {
    if (!selectedCycle) return;

    const cycle =
      selectedCycle.academicCycle.customLabel ??
      selectedCycle.academicCycle.globalCycle?.label ??
      "Academic Term";

    // Only track if different from defaults
    const defaultCycleLabel =
      defaultCycle?.academicCycle.customLabel ??
      defaultCycle?.academicCycle.globalCycle?.label ??
      "Academic Term";

    if (cycle !== defaultCycleLabel) {
      posthog.capture("ViewContent", {
        program: programName,
        cycle,
      });
    }
  }, [selectedCycle, defaultCycle, programName, posthog]);

  return null; // This component doesn't render anything
}
