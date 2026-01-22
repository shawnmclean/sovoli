"use client";

import { useEffect } from "react";
import type { ProjectGroup } from "~/modules/projects/types";
import { trackProjectGroupAnalytics } from "../lib/projectAnalytics";

interface ProjectGroupTrackingProps {
  group: ProjectGroup;
}

export function ProjectGroupTracking({ group }: ProjectGroupTrackingProps) {
  // Track initial load with defaults
  useEffect(() => {
    trackProjectGroupAnalytics("ViewContent", group);
  }, [group]);

  return null; // This component doesn't render anything
}
