import type { Project } from "~/modules/projects/types";
import posthog from "posthog-js";

interface ProjectAnalyticsData {
  project: Project;
  projectName: string;
  projectId: string;
  status?: string;
  priority?: string;
  category?: string;
}

// Get project name
const getProjectName = (project: Project) => {
  return project.title ?? "Project";
};

// Centralized analytics data preparation
const prepareProjectAnalytics = (project: Project): ProjectAnalyticsData => {
  const projectName = getProjectName(project);

  return {
    project,
    projectName,
    projectId: project.id,
    status: project.status,
    priority: project.priority,
    category: project.category,
  };
};

// Single analytics function that components can call
export const trackProjectAnalytics = (
  event: "ViewContent" | "SectionOpened",
  project: Project,
  additionalData?: Record<string, unknown>,
) => {
  const analyticsData = prepareProjectAnalytics(project);

  // https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-events
  posthog.capture(event, {
    content_category: analyticsData.category ?? "Project",
    content_name: analyticsData.projectName,
    content_type: "project",
    content_ids: [analyticsData.projectId],
    ...(analyticsData.status && { project_status: analyticsData.status }),
    ...(analyticsData.priority && { project_priority: analyticsData.priority }),
    ...additionalData,
  });
};

// Export utility functions for use in components that need them directly
export { getProjectName };
