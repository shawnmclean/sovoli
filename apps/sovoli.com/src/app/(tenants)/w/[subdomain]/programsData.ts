export interface ProgramData {
  id: number;
  name: string;
  description: string;
  image: string;
  requirements?: Requirement[];
}

// Requirement Model (Modular and Flexible)
export interface Requirement {
  type: "age" | "document";
  description?: string; // Detailed description of the requirement
  ageRange?: AgeRange; // Only if type is "age"
  name?: string;
}

// Age Range Model (Precise Age Control)
export interface AgeRange {
  minAgeYears?: number;
  minAgeMonths?: number;
  maxAgeYears?: number;
  maxAgeMonths?: number;
}

export const programsData: ProgramData[] = [
  {
    id: 1,
    name: "Pre-Nursery (Play School)",
    description: "Strong foundational learning in a nurturing environment",
    image: "https://img.heroui.chat/image/places?w=600&h=400&u=1",
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
    description:
      "Engaging curriculum fostering critical thinking and creativity",
    image: "https://img.heroui.chat/image/places?w=600&h=400&u=2",
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
    description: "Strong foundational learning in a nurturing environment",
    image: "https://img.heroui.chat/image/places?w=600&h=400&u=3",
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
    description:
      "Engaging curriculum fostering critical thinking and creativity",
    image: "https://img.heroui.chat/image/places?w=600&h=400&u=4",
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
];
