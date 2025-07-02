import type { AcademicModule } from "~/modules/academics/types";
import { GY_PRIMARY_V1 } from "~/modules/data/academics/guyana/programs";

export const GREEN_ACRES_SCHOOL_ACADEMIC: AcademicModule = {
  programs: [
    {
      standardProgramVersion: GY_PRIMARY_V1,
      slug: "primary",
    },
  ],
};
