import { parseProjectsModule } from "~/modules/data/organisations/utils/parseProjectsModule";
import type { ProjectsModule } from "~/modules/projects/types";
import { WILLIAMS_ELITE_ACADEMY_NEEDS } from "./needs";
import projectsData from "./projects.json";

export const WILLIAMS_ELITE_ACADEMY_PROJECTS: ProjectsModule =
  parseProjectsModule(projectsData, WILLIAMS_ELITE_ACADEMY_NEEDS);
