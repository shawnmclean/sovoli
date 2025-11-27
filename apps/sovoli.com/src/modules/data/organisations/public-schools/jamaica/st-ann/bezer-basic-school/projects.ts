import type { ProjectsModule } from "~/modules/projects/types";
import { parseProjectsModule } from "~/modules/data/organisations/utils/parseProjectsModule";
import { BEZER_BASIC_SCHOOL_NEEDS } from "./needs";
import projectsData from "./projects.json";

export const BEZER_BASIC_SCHOOL_PROJECTS: ProjectsModule = parseProjectsModule(
  projectsData,
  BEZER_BASIC_SCHOOL_NEEDS,
);

