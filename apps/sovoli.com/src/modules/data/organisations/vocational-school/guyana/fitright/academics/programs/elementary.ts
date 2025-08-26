import type { Program } from "~/modules/academics/types";
import { ELEMENTARY_SEWING_PHOTOS } from "../../photos";
import {
  FITRIGHT_SEWING_PROGRAM_GROUP,
  fitrightProgramQuickFacts,
  sewingClassProgramHighlights,
  fitrightProgramRequirements,
} from "./shared";
import { FITRIGHT_ELEMENTARY_SEWING_SEPTEMBER_2025 } from "../cycles";

export const FITRIGHT_ELEMENTARY_SEWING_PROGRAM: Program = {
  id: "fr-elementary-sewing",
  name: "Elementary Sewing",
  slug: "elementary-sewing",
  audience: "student",
  quickFacts: fitrightProgramQuickFacts,
  highlights: [
    ...sewingClassProgramHighlights,
    {
      icon: "graduation-cap",
      label: "Make & Take Skirt",
      description:
        "Create your own skirt at the end of the course and take it home.",
    },
  ],
  description:
    "This is a 4-week program that teaches students how to sew a skirt. It is designed for students who are new to sewing and want to learn the basics of sewing.",
  whatYouWillLearn: [
    {
      heading: "Seams",
      items: [
        {
          id: "basic-seams",
          title: "Master basic seam techniques",
          blurb:
            "Learn to sew straight seams with consistent seam allowance and proper finishing.",
          tag: "Foundations",
        },
      ],
    },
    {
      heading: "Fabric & Materials",
      items: [
        {
          id: "fabric-selection",
          title: "Choose appropriate fabrics",
          blurb:
            "Understand different fabric types and select the right material for your project.",
        },
        {
          id: "grain-lines",
          title: "Work with grain lines",
          blurb:
            "Identify and respect fabric grain to ensure proper fit and drape.",
        },
        {
          id: "thread-basics",
          title: "Thread selection and care",
          blurb:
            "Select the right thread type and learn proper threading techniques.",
        },
      ],
    },
    {
      heading: "Measurements & Fitting",
      items: [
        {
          id: "body-measurements",
          title: "Take accurate body measurements",
          blurb:
            "Learn to measure waist, hip, and length for proper garment fitting.",
          tag: "Hands-on",
        },
      ],
    },
    {
      heading: "Cutting & Construction",
      items: [
        {
          id: "pattern-cutting",
          title: "Cut fabric accurately",
          blurb:
            "Cut pattern pieces with precision and proper grain alignment.",
        },
        {
          id: "skirt-construction",
          title: "Construct a complete skirt",
          blurb:
            "Build a wearable skirt with darts, zipper, waistband, and hem finishing.",
          tag: "Capstone",
        },
      ],
    },
  ],
  requirements: fitrightProgramRequirements,
  photos: ELEMENTARY_SEWING_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 1 },
  cycles: [FITRIGHT_ELEMENTARY_SEWING_SEPTEMBER_2025],
};
