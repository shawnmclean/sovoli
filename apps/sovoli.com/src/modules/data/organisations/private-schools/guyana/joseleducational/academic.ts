import type { AcademicModule } from "~/modules/academics/types";
import {
  GY_PRIMARY_V1,
  GY_SECONDARY_V1,
} from "~/modules/data/academics/guyana/programs";

export const JOSEL_EDUCATIONAL_ACADEMIC: AcademicModule = {
  programs: [
    {
      standardProgramVersion: GY_PRIMARY_V1,
      slug: "primary",
    },
    {
      standardProgramVersion: GY_SECONDARY_V1,
      slug: "secondary",
    },
  ],
};
