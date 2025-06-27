import type { AcademicModule } from "~/modules/academics/types";

export const JOSEL_EDUCATIONAL_ACADEMIC: AcademicModule = {
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
    {
      id: 2,
      name: "Secondary",
      slug: "secondary",
      description:
        "Engaging curriculum fostering critical thinking and creativity",
      image: "/images/programs/secondary.jpg",
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
