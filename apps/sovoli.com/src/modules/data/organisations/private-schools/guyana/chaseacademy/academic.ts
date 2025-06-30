import type { AcademicModule } from "~/modules/academics/types";

export const CHASE_ACADEMY_ACADEMIC: AcademicModule = {
  programs: [
    {
      id: 1,
      name: "Secondary",
      slug: "secondary",
      description:
        "Engaging curriculum fostering critical thinking and creativity",
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
};
