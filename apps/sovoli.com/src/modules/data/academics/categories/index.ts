import type { ProgramCategoryDefinition } from "~/modules/academics/categories/types";
import { programCategoryDefinitionSchema } from "~/modules/academics/categories/types";
import academicEducationData from "./academicEducation.json";
import beautyAestheticsPersonalCareData from "./beautyAestheticsPersonalCare.json";
import fashionAndSewingData from "./fashionAndSewing.json";

const categoryData = [
  beautyAestheticsPersonalCareData,
  fashionAndSewingData,
  academicEducationData,
] as const;

export const PROGRAM_CATEGORY_TREE: ProgramCategoryDefinition[] =
  programCategoryDefinitionSchema.array().parse(categoryData.flat());
