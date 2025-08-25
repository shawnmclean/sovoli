import type { Program } from "~/modules/academics/types";
import { ADVANCED_SEWING_PHOTOS } from "../../photos";
import {
  FITRIGHT_SEWING_PROGRAM_GROUP,
  fitrightProgramQuickFacts,
  sewingClassProgramHighlights,
} from "./shared";
import { FITRIGHT_ADVANCED_SEWING_NOVEMBER_2025 } from "../cycles";

export const FITRIGHT_ADVANCED_SEWING_PROGRAM: Program = {
  id: "fr-advanced-sewing",
  name: "Advanced Sewing",
  slug: "advanced-sewing",
  audience: "student",
  quickFacts: fitrightProgramQuickFacts,
  highlights: [
    ...sewingClassProgramHighlights,
    {
      icon: "graduation-cap",
      label: "Make & Take Suit",
      description:
        "Create your own pants, dress and top at the end of the course and take it home.",
    },
  ],
  description:
    "This is a 6-week program that teaches students how to sew a pants, dress and top. It is designed for students who are new to sewing and want to learn the basics of sewing.",
  photos: ADVANCED_SEWING_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 3 },
  cycles: [FITRIGHT_ADVANCED_SEWING_NOVEMBER_2025],
};
