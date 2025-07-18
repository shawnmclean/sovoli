"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { useProgramSelection } from "../context/ProgramSelectionContext";

import type {
  OrgProgram,
  OrgProgramCycle,
  ProgramLevel,
} from "~/modules/academics/types";

interface ProgramTrackingProps {
  program: OrgProgram;
  defaultCycle?: OrgProgramCycle | null;
  defaultLevel?: ProgramLevel | null;
}

export function ProgramTracking({
  program,
  defaultCycle,
  defaultLevel,
}: ProgramTrackingProps) {
  const posthog = usePostHog();
  const { selectedCycle, selectedLevel } = useProgramSelection();

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "Program";
  // Track initial load with defaults
  useEffect(() => {
    if (!defaultCycle) return;

    const defaultCycleLabel =
      defaultCycle.academicCycle.customLabel ??
      defaultCycle.academicCycle.globalCycle?.label ??
      "Academic Term";

    const defaultLevelLabel = defaultLevel?.label ?? null;

    posthog.capture("ViewContent", {
      program: programName,
      cycle: defaultCycleLabel,
      level: defaultLevelLabel,
    });
  }, [defaultCycle, defaultLevel, programName, posthog]);

  // Track when selections change from defaults
  useEffect(() => {
    if (!selectedCycle) return;

    const cycle =
      selectedCycle.academicCycle.customLabel ??
      selectedCycle.academicCycle.globalCycle?.label ??
      "Academic Term";

    const level = selectedLevel?.label ?? null;

    // Only track if different from defaults
    const defaultCycleLabel =
      defaultCycle?.academicCycle.customLabel ??
      defaultCycle?.academicCycle.globalCycle?.label ??
      "Academic Term";

    const defaultLevelLabel = defaultLevel?.label ?? null;

    if (cycle !== defaultCycleLabel || level !== defaultLevelLabel) {
      posthog.capture("ViewContent", {
        program: programName,
        cycle,
        level,
      });
    }
  }, [
    selectedCycle,
    selectedLevel,
    defaultCycle,
    defaultLevel,
    programName,
    posthog,
  ]);

  return null; // This component doesn't render anything
}
