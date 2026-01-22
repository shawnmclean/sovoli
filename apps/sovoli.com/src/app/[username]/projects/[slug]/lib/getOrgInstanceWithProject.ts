import { cache } from "react";
import "server-only";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Project, ProjectGroup } from "~/modules/projects/types";
import { bus } from "~/services/core/bus";
import { slugify } from "~/utils/slugify";

const getCachedOrgInstanceWithProject = async (
  username: string,
  slug: string,
): Promise<{
  orgInstance: OrgInstance;
  project?: Project;
  group?: ProjectGroup;
} | null> => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );

  if (!result.orgInstance) return null;

  // First, try to find a project by slug
  const project = result.orgInstance.projectsModule?.projects.find(
    (p) => slugify(p.title) === slug || p.id === slug,
  );

  if (project) {
    return { orgInstance: result.orgInstance, project };
  }

  // If no project found, check if slug matches a group
  const projectWithGroup = result.orgInstance.projectsModule?.projects.find(
    (p) => p.group?.slug === slug,
  );

  const group = projectWithGroup?.group;

  if (!group) return null;

  // Find all projects that belong to this group
  const groupProjects =
    result.orgInstance.projectsModule?.projects
      .filter((p) => p.group?.id === group.id)
      .sort((a, b) => {
        const aOrder = a.group?.order ?? 999;
        const bOrder = b.group?.order ?? 999;
        return aOrder - bOrder;
      }) ?? [];

  // Return the group with its projects populated
  return {
    orgInstance: result.orgInstance,
    group: {
      ...group,
      projects: groupProjects,
    },
  };
};

/**
 * @description Get the org instance with the project, if the slug matches a group, then we return the group and the projects
 */
export const getOrgInstanceWithProject = cache(getCachedOrgInstanceWithProject);
