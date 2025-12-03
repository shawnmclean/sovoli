"use client";

import { useEffect } from "react";
import { trackProjectGroupAnalytics } from "../lib/projectAnalytics";

import type { ProjectGroup } from "~/modules/projects/types";

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

