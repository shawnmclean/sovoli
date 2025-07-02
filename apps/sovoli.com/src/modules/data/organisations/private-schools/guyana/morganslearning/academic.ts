import type { AcademicModule } from "~/modules/academics/types";
import { GY_SECONDARY_V1 } from "~/modules/data/academics/guyana/programs";

// Morgan's Learning Centre also offers exam prep and online classes
export const MORGANS_LEARNING_ACADEMIC: AcademicModule = {
  programs: [
    {
      standardProgramVersion: GY_SECONDARY_V1,
      slug: "secondary",
    },
  ],

  programCycles: [],
};
