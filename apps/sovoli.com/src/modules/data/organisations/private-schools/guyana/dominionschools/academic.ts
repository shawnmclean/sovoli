import type { AcademicModule } from "~/modules/academics/types";

export const DOMINION_SCHOOLS_ACADEMIC: AcademicModule = {
  programs: [
    {
      id: 1,
      name: "Nursery",
      slug: "nursery",
      description:
        "Engaging curriculum fostering critical thinking and creativity",
      requirements: [
        {
          type: "age",
          ageRange: {
            minAgeYears: 3,
            minAgeMonths: 3,
            maxAgeYears: 5,
            maxAgeMonths: 6,
          },
        },
      ],
    },
    {
      id: 2,
      name: "Primary",
      slug: "primary",
      description: "Strong foundational learning in a nurturing environment",
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
