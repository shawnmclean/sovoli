import type { AcademicModule } from "~/modules/academics/types";
import { GY_SECONDARY_V1 } from "~/modules/data/academics/guyana/programs";

export const CHASE_ACADEMY_ACADEMIC: AcademicModule = {
  programs: [
    {
      standardProgramVersion: GY_SECONDARY_V1,
      slug: "secondary",
      image: "/orgs/defaults/programs/secondary.webp",
      requirements: [
        {
          type: "age",
          ageRange: {
            minAgeYears: 12,
            minAgeMonths: 0,
          },
        },
      ],
    },
  ],
  programCycles: [],
};
