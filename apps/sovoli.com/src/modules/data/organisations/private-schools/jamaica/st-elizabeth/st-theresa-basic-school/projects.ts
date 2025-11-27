import type { ProjectsModule } from "~/modules/projects/types";
import { parseProjectsModule } from "~/modules/data/organisations/utils/parseProjectsModule";
import { ST_THERESA_BASIC_SCHOOL_NEEDS } from "./needs";
import projectsData from "./projects.json";

export const ST_THERESA_BASIC_SCHOOL_PROJECTS: ProjectsModule = parseProjectsModule(
  projectsData,
  ST_THERESA_BASIC_SCHOOL_NEEDS,
);

