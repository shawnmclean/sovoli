import type { AcademicModule } from "~/modules/academics/types";
import {
  APPLETON_NURSERY_YEAR_1_PROGRAM,
  APPLETON_NURSERY_YEAR_2_PROGRAM,
} from "./academics/programs";

export const APPLETON_BASIC_SCHOOL_ACADEMIC: AcademicModule = {
  programs: [APPLETON_NURSERY_YEAR_1_PROGRAM, APPLETON_NURSERY_YEAR_2_PROGRAM],
};
