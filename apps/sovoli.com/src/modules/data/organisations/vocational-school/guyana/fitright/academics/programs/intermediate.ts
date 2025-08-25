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
  photos: INTEMEDIATE_SEWING_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 2 },
  cycles: [FITRIGHT_INTERMEDIATE_SEWING_OCTOBER_2025],
};
