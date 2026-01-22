import { parseProjectsModule } from "~/modules/data/organisations/utils/parseProjectsModule";
import type { ProjectsModule } from "~/modules/projects/types";
import { JABNEH_CHRISTIAN_ACADEMY_NEEDS } from "./needs";
import projectsData from "./projects.json";

export const JABNEH_CHRISTIAN_ACADEMY_PROJECTS: ProjectsModule =
  parseProjectsModule(projectsData, JABNEH_CHRISTIAN_ACADEMY_NEEDS);
