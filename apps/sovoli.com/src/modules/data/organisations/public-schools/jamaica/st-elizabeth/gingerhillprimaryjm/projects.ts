import { parseProjectsModule } from "~/modules/data/organisations/utils/parseProjectsModule";
import type { ProjectsModule } from "~/modules/projects/types";
import { GINGER_HILL_PRIMARY_NEEDS } from "./needs";
import projectsData from "./projects.json";

export const GINGER_HILL_PRIMARY_PROJECTS: ProjectsModule = parseProjectsModule(
  projectsData,
  GINGER_HILL_PRIMARY_NEEDS,
);
