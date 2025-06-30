import type { AcademicModule } from "~/modules/academics/types";

// Morgan's Learning Centre also offers exam prep and online classes
export const MORGANS_LEARNING_ACADEMIC: AcademicModule = {
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
