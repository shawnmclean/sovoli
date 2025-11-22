import { cache } from "react";
import "server-only";
import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { slugify } from "~/utils/slugify";
import type { Project } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";

const getCachedOrgInstanceWithProject = async (
  username: string,
  slug: string,
): Promise<{
  orgInstance: OrgInstance;
  project: Project;
} | null> => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );

  if (!result.orgInstance) return null;

  const project = result.orgInstance.projectsModule?.projects.find(
    (p) => slugify(p.title) === slug || p.id === slug,
  );

  if (!project) return null;

  return { orgInstance: result.orgInstance, project };
};

/**
 * @description Get the org instance with the project
 */
export const getOrgInstanceWithProject = cache(getCachedOrgInstanceWithProject);
