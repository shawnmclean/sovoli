import type { Program } from "~/modules/academics/types";
import { INTEMEDIATE_SEWING_PHOTOS } from "../../photos";
import {
  FITRIGHT_SEWING_PROGRAM_GROUP,
  fitrightProgramQuickFacts,
  sewingClassProgramHighlights,
} from "./shared";
import { FITRIGHT_INTERMEDIATE_SEWING_OCTOBER_2025 } from "../cycles";

export const FITRIGHT_INTERMEDIATE_SEWING_PROGRAM: Program = {
  id: "fr-intermediate-sewing",
  name: "Intermediate Sewing",
  slug: "intermediate-sewing",
  audience: "student",
  quickFacts: fitrightProgramQuickFacts,
  highlights: [
    ...sewingClassProgramHighlights,
    {
      icon: "graduation-cap",
      label: "Make & Take Blouse",
      description:
        "Create your own blouse or skirt at the end of the course and take it home.",
    },
  ],
  description:
    "This is a 6-week program that teaches students how to sew a blouse. It is designed for students who are new to sewing and want to learn the basics of sewing.",
  courses: [
    {
      id: "fr-intermediate-sewing-course-0",
      subject: { id: "measurements", name: "Body Measurements" },
      title: "Upper Body Measurements",
      units: [
        {
          title: "Upper Body Measurements",
          topics: ["Upper Body Measurements"],
        },
      ],
    },
    {
      id: "fr-intermediate-sewing-course-1",
      subject: { id: "sleeves", name: "Sleeves" },
      title: "Sleeves",
      units: [
        {
          title: "Sleeves",
          topics: ["Sleeves"],
        },
      ],
    },
    {
      id: "fr-intermediate-sewing-course-2",
      subject: { id: "collars", name: "Collars" },
      title: "Collars",
      units: [
        {
          title: "Collars",
          topics: ["Collars"],
        },
      ],
    },
    {
      id: "fr-intermediate-sewing-course-3",
      subject: { id: "facings", name: "Facings" },
      title: "Facings",
      units: [
        {
          title: "Facings",
          topics: ["Facings"],
        },
      ],
    },
    // measure
    {
      id: "fr-intermediate-sewing-course-2",
      subject: { id: "blouse", name: "Blouse/Shirt" },
      title: "Blouse",
      units: [
        {
          title: "Make a Blouse/Shirt",
          topics: ["Blouse"],
        },
      ],
    },
  ],
  photos: INTEMEDIATE_SEWING_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 2 },
  cycles: [FITRIGHT_INTERMEDIATE_SEWING_OCTOBER_2025],
};
