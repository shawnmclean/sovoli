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
  const programId = program.id;
  // Track initial load with defaults
  useEffect(() => {
    if (!defaultCycle) return;

    const defaultCycleLabel =
      defaultCycle.academicCycle.customLabel ??
      defaultCycle.academicCycle.globalCycle?.label ??
      "Academic Term";

    posthog.capture("ViewContent", {
      content_name: programName,
      content_type: "product",
      content_ids: [programId],
      cycle: defaultCycleLabel,
    });
  }, [defaultCycle, programName, programId, posthog]);

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
        content_name: programName,
        content_type: "product",
        content_ids: [programId],
        cycle: defaultCycleLabel,
      });
    }
  }, [selectedCycle, defaultCycle, programName, programId, posthog]);

  return null; // This component doesn't render anything
}
