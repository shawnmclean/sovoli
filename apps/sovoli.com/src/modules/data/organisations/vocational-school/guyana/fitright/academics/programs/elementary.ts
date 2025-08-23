import type { Program } from "~/modules/academics/types";
import { BAG_WORKSHOP_PHOTOS } from "../../photos";
import {
  FITRIGHT_SEWING_PROGRAM_GROUP,
  sewingClassProgramHighlights,
} from "./shared";
import { FITRIGHT_ELEMENTARY_SEWING_SEPTEMBER_2025 } from "../cycles";

export const FITRIGHT_ELEMENTARY_SEWING_PROGRAM: Program = {
  id: "fr-elementary-sewing",
  name: "Elementary Sewing",
  slug: "elementary-sewing",
  audience: "student",
  highlights: sewingClassProgramHighlights,
  photos: BAG_WORKSHOP_PHOTOS,
  group: { ...FITRIGHT_SEWING_PROGRAM_GROUP, order: 1 },
  cycles: [FITRIGHT_ELEMENTARY_SEWING_SEPTEMBER_2025],
};
