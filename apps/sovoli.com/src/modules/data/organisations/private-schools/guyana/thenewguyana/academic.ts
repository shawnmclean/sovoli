import type { AcademicModule } from "~/modules/academics/types";
import {
  GY_NURSERY_V1,
  GY_PRIMARY_V1,
  GY_SECONDARY_V1,
} from "~/modules/data/academics/guyana/programs";

export const THE_NEW_GUYANA_ACADEMIC: AcademicModule = {
  programs: [
    {
      slug: "nursery",
      standardProgramVersion: GY_NURSERY_V1,
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
};
