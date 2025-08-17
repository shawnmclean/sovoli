import {
  GY_PRIMARY_GRADE_1_V1,
  GY_PRIMARY_GRADE_2_V1,
  GY_PRIMARY_GRADE_3_V1,
  GY_PRIMARY_GRADE_4_V1,
  GY_PRIMARY_GRADE_5_V1,
  GY_PRIMARY_GRADE_6_V1,
} from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import {
  MAGY_PRIMARY_GRADE_1_2025_T1,
  MAGY_PRIMARY_GRADE_2_2025_T1,
  MAGY_PRIMARY_GRADE_3_2025_T1,
  MAGY_PRIMARY_GRADE_4_2025_T1,
  MAGY_PRIMARY_GRADE_5_2025_T1,
  MAGY_PRIMARY_GRADE_6_2025_T1,
} from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import { primaryProgramHighlights } from "./shared";

export const MAGY_PRIMARY_GRADE_1_PROGRAM: Program = {
  id: "magy-primary-grade-1",
  slug: "grade-1",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_1_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_1_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
};

export const MAGY_PRIMARY_GRADE_2_PROGRAM: Program = {
  id: "magy-primary-grade-2",
  slug: "grade-2",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_2_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_2_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
};

export const MAGY_PRIMARY_GRADE_3_PROGRAM: Program = {
  id: "magy-primary-grade-3",
  slug: "grade-3",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_3_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_3_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
};

export const MAGY_PRIMARY_GRADE_4_PROGRAM: Program = {
  id: "magy-primary-grade-4",
  slug: "grade-4",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_4_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_4_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
};

export const MAGY_PRIMARY_GRADE_5_PROGRAM: Program = {
  id: "magy-primary-grade-5",
  slug: "grade-5",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_5_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_5_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
};

export const MAGY_PRIMARY_GRADE_6_PROGRAM: Program = {
  id: "magy-primary-grade-6",
  slug: "grade-6",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_6_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_6_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
};
