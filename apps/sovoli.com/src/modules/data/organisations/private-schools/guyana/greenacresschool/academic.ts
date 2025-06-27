import type { AcademicModule } from "~/modules/academics/types";

export const GREEN_ACRES_SCHOOL_ACADEMIC: AcademicModule = {
  programs: [
    {
      id: 1,
      name: "Primary",
      slug: "primary",
      description: "Strong foundational learning in a nurturing environment",
      image: "/orgs/defaults/programs/primary.webp",
      requirements: [
        {
          type: "age",
          ageRange: {
            minAgeYears: 5,
            minAgeMonths: 0,
            maxAgeYears: 12,
            maxAgeMonths: 0,
          },
        },
      ],
    },
  ],
};
