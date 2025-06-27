import type { AcademicModule } from "~/modules/academics/types";

export const MARIAN_ACADEMY_ACADEMIC: AcademicModule = {
  programs: [
    {
      id: 1,
      name: "Nursery",
      slug: "nursery",
      description:
        "Engaging curriculum fostering critical thinking and creativity",
      image: "/orgs/defaults/programs/nursery.webp",
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
      id: 3,
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
