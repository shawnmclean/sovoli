import type { Program } from "~/modules/academics/types";
import { INTEMEDIATE_SEWING_PHOTOS } from "../../photos";
import {
  FITRIGHT_SEWING_PROGRAM_GROUP,
  fitrightProgramQuickFacts,
  sewingClassProgramHighlights,
  fitrightProgramRequirements,
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
    "This is a 4-week program that teaches students how to sew a blouse. It is designed for students who are new to sewing and want to learn the basics of sewing.",
  whatYouWillLearn: [
    {
      heading: "Body Measurements & Fitting",
      items: [
        {
          id: "upper-body-measurements",
          title: "Take upper body measurements",
          blurb:
            "Learn to measure bust, waist, shoulder width, and arm length for proper blouse fitting.",
          tag: "Foundations",
        },
      ],
    },
    {
      heading: "Sleeve Construction",
      items: [
        {
          id: "sleeve-basics",
          title: "Understand sleeve construction",
          blurb:
            "Learn sleeve types, armhole fitting, and sleeve attachment techniques.",
        },
        {
          id: "sleeve-patterns",
          title: "Draft and fit sleeve patterns",
          blurb:
            "Create sleeve patterns that fit properly with the armhole and body.",
        },
      ],
    },
    {
      heading: "Collar Techniques",
      items: [
        {
          id: "collar-types",
          title: "Work with different collar styles",
          blurb:
            "Learn to construct various collar types including flat and stand-up collars.",
        },
        {
          id: "collar-attachment",
          title: "Attach collars professionally",
          blurb:
            "Master the techniques for clean, professional collar attachment.",
        },
      ],
    },
    {
      heading: "Facings & Finishing",
      items: [
        {
          id: "facing-techniques",
          title: "Apply facings correctly",
          blurb:
            "Learn to cut, sew, and attach facings for clean garment edges.",
        },
        {
          id: "professional-finishing",
          title: "Achieve professional finishes",
          blurb:
            "Master techniques for clean edges, proper pressing, and final touches.",
        },
      ],
    },
    {
      heading: "Blouse Construction",
      items: [
        {
          id: "blouse-pattern",
          title: "Create blouse pattern",
          blurb:
            "Draft a complete blouse pattern incorporating all learned techniques.",
        },
        {
          id: "complete-blouse",
          title: "Construct a complete blouse",
          blurb:
            "Build a professional blouse with sleeves, collar, facings, and proper finishing.",
          tag: "Capstone",
        },
      ],
    },
  ],
  requirements: fitrightProgramRequirements,
  photos: INTEMEDIATE_SEWING_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 2 },
  cycles: [FITRIGHT_INTERMEDIATE_SEWING_OCTOBER_2025],
};
