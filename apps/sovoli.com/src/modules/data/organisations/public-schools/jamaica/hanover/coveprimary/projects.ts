import type { ProjectsModule } from "~/modules/projects/types";
import { parseProjectsModule } from "~/modules/data/organisations/utils/parseProjectsModule";
import { COVE_PRIMARY_NEEDS } from "./needs";
import projectsData from "./projects.json";

export const COVE_PRIMARY_PROJECTS: ProjectsModule = parseProjectsModule(
  projectsData,
  COVE_PRIMARY_NEEDS,
);
