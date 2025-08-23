import type { Program } from "~/modules/academics/types";
import { BAG_WORKSHOP_PHOTOS } from "../../photos";
import {
  FITRIGHT_SEWING_PROGRAM_GROUP,
  sewingClassProgramHighlights,
} from "./shared";
import { FITRIGHT_ADVANCED_SEWING_NOVEMBER_2025 } from "../cycles";

export const FITRIGHT_ADVANCED_SEWING_PROGRAM: Program = {
  id: "fr-advanced-sewing",
  name: "Advanced Sewing",
  slug: "advanced-sewing",
  audience: "student",
  highlights: [
    ...sewingClassProgramHighlights,
    {
      icon: "graduation-cap",
      label: "Make & Take Suit",
      description:
        "Create your own pants, dress and top at the end of the course and take it home.",
    },
  ],
  photos: BAG_WORKSHOP_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 3 },
  cycles: [FITRIGHT_ADVANCED_SEWING_NOVEMBER_2025],
};
