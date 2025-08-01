"use client";

import { useEffect } from "react";
import { trackProgramGroupAnalytics } from "../lib/programAnalytics";

import type { ProgramGroup } from "~/modules/academics/types";

interface ProgramGroupTrackingProps {
  group: ProgramGroup;
}

export function ProgramGroupTracking({ group }: ProgramGroupTrackingProps) {
  // Track initial load with defaults
  useEffect(() => {
    trackProgramGroupAnalytics("ViewContent", group);
  }, [group]);

  return null; // This component doesn't render anything
}
