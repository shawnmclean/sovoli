import type { Program } from "~/modules/academics/types";
import { BAG_WORKSHOP_PHOTOS } from "../../photos";
import {
  FITRIGHT_SEWING_PROGRAM_GROUP,
  sewingClassProgramHighlights,
} from "./shared";
import { FITRIGHT_INTERMEDIATE_SEWING_OCTOBER_2025 } from "../cycles";

export const FITRIGHT_INTERMEDIATE_SEWING_PROGRAM: Program = {
  id: "fr-intermediate-sewing",
  name: "Intermediate Sewing",
  slug: "intermediate-sewing",
  audience: "student",
  highlights: sewingClassProgramHighlights,
  photos: BAG_WORKSHOP_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 2 },
  cycles: [FITRIGHT_INTERMEDIATE_SEWING_OCTOBER_2025],
};
