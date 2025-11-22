"use client";

import { useEffect } from "react";
import { trackProjectAnalytics } from "../lib/projectAnalytics";
import type { Project } from "~/modules/projects/types";

interface ProjectTrackingProps {
  project: Project;
}

export function ProjectTracking({ project }: ProjectTrackingProps) {
  // Track initial load
  useEffect(() => {
    trackProjectAnalytics("ViewContent", project);
  }, [project]);

  return null; // This component doesn't render anything
}
