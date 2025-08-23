import type { Program } from "~/modules/academics/types";
import { BAG_WORKSHOP_PHOTOS } from "../../photos";
import {
  FITRIGHT_SEWING_PROGRAM_GROUP,
  fitrightProgramQuickFacts,
  sewingClassProgramHighlights,
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
    "This is a 6-week program that teaches students how to sew a skirt. It is designed for students who are new to sewing and want to learn the basics of sewing.",
  photos: BAG_WORKSHOP_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 1 },
  cycles: [FITRIGHT_ELEMENTARY_SEWING_SEPTEMBER_2025],
};
