import type { AcademicModule } from "~/modules/academics/types";

export const MODERN_ACADEMY_ACADEMIC: AcademicModule = {
  programs: [
    {
      id: 1,
      name: "Pre-Nursery",
      title: "Pre-Nursery (Play School)",
      slug: "pre-nursery",
      description: "Strong foundational learning in a nurturing environment",
      image: "/images/programs/pre-nursery.jpg",
      requirements: [
        {
          type: "age",
          ageRange: {
            minAgeYears: 2,
            minAgeMonths: 0,
            maxAgeYears: 3,
            maxAgeMonths: 0,
          },
        },
      ],
    },
    {
      id: 2,
      name: "Nursery",
      slug: "nursery",
      description:
        "Engaging curriculum fostering critical thinking and creativity",
      image: "/images/programs/nursery.jpg",
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
      id: 3,
      name: "Primary",
      slug: "primary",
      description: "Strong foundational learning in a nurturing environment",
      image: "/images/programs/primary.png",
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
        {
          type: "document",
          name: "Completed Elementary Education Certificate",
          description:
            "A valid certificate issued by the school's Elementary Education Department.",
        },
      ],
    },
    {
      id: 4,
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
        {
          type: "document",
          name: "Completed Middle School Certificate",
          description:
            "A valid certificate issued by the school's Middle School Department.",
        },
      ],
    },
  ],
};
