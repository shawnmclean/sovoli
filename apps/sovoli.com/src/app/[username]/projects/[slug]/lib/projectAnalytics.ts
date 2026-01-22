import posthog from "posthog-js";
import type { Project, ProjectGroup } from "~/modules/projects/types";

interface ProjectAnalyticsData {
  project: Project;
  projectName: string;
  projectId: string;
  status?: string;
  priority?: string;
}

// Get project name
const getProjectName = (project: Project) => {
  return project.title;
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
    type: "project",
    content_category: analyticsData.project.group?.name ?? "Project",
    content_name: analyticsData.projectName,
    content_type: "product",
    content_ids: [analyticsData.projectId],
    ...(analyticsData.status && { project_status: analyticsData.status }),
    ...(analyticsData.priority && { project_priority: analyticsData.priority }),
    ...additionalData,
  });
};

export const trackProjectGroupAnalytics = (
  event: "ViewContent",
  group: ProjectGroup,
) => {
  posthog.capture(event, {
    content_category: "Project Group",
    content_name: group.name,
    content_type: "product_group",
    content_ids: [group.id],
  });
};

// Export utility functions for use in components that need them directly
export { getProjectName };
