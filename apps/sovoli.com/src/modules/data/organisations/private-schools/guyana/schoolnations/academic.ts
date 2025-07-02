import type { AcademicModule } from "~/modules/academics/types";
import {
  GY_NURSERY_V1,
  GY_PRIMARY_V1,
  GY_SECONDARY_V1,
} from "~/modules/data/academics/guyana/programs";

export const SCHOOL_NATIONS_ACADEMIC: AcademicModule = {
  programs: [
    {
      standardProgramVersion: GY_NURSERY_V1,
      slug: "nursery",
    },
    {
      standardProgramVersion: GY_PRIMARY_V1,
      slug: "primary",
    },
    {
      standardProgramVersion: GY_SECONDARY_V1,
      slug: "secondary",
    },
  ],

  programCycles: [],
};
