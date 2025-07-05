import type { OrgScoreRule } from "../types";

const MAX_SCORE = 30;
export const hasFees: OrgScoreRule = {
  key: "hasFees",
  maxScore: MAX_SCORE,
  compute: ({ academicModule }) => {
    const programCycles = academicModule?.programCycles ?? [];
    const totalProgramCycles = programCycles.length;

    if (totalProgramCycles === 0) {
      return Promise.resolve({
        score: 0,
        note: "No programs found",
      });
    }

    // Count how many programs have a fee structure with amounts greater than 0
    const programsWithFee = programCycles.filter((cycle) => {
      const fees = cycle.feeStructure?.fees ?? [];
      return (
        fees.length > 0 &&
        fees.some((fee) => {
          return (
            fee.appliesTo.includes("program") &&
            Object.values(fee.amount).some((amount) => amount > 0)
          );
        })
      );
    }).length;

    const score = Math.round(
      (programsWithFee / totalProgramCycles) * MAX_SCORE,
    );

    return Promise.resolve({
      score,
      note:
        programsWithFee === totalProgramCycles
          ? "All programs have fees listed"
          : `${programsWithFee} out of ${totalProgramCycles} programs have fees listed`,
    });
  },
};
