import type { OrgScoreRule } from "../types";

export const hasAcademicPrograms: OrgScoreRule = {
  key: "hasAcademicPrograms",
  maxScore: 10,
  compute: ({ academicModule }) =>
    Promise.resolve({
      score: (academicModule?.programs.length ?? 0) > 0 ? 10 : 0,
      note:
        (academicModule?.programs.length ?? 0) > 0
          ? "Academic programs are listed"
          : "Academic programs are not listed",
    }),
};
