import type { OrgScoreRule } from "../types";

export const hasFees: OrgScoreRule = {
  key: "hasFees",
  maxScore: 10,
  compute: ({ academicModule }) => {
    // Count how many programs exist
    const programs = academicModule?.programs ?? [];
    const totalPrograms = programs.length;

    if (totalPrograms === 0) {
      return Promise.resolve({
        score: 0,
        note: "No programs found",
      });
    }

    // Count how many programs have a fee structure (tuitionFee is required in the model)
    const programsWithFee = programs.filter(
      (program) =>
        program.feeStructure &&
        typeof program.feeStructure.tuitionFee === "number",
    ).length;

    const score = Math.round((programsWithFee / totalPrograms) * 10);

    return Promise.resolve({
      score,
      note:
        programsWithFee === totalPrograms
          ? "All programs have fees listed"
          : `${programsWithFee} out of ${totalPrograms} programs have fees listed`,
    });
  },
};
