import type { OrgScoreRule } from "../types";

export const hasTeachers: OrgScoreRule = {
  key: "hasTeachers",
  maxScore: 5,
  compute: ({ workforceModule }) => {
    const teachers = workforceModule?.members.filter((member) =>
      member.roleAssignments.some(
        (assignment) => assignment.position.name === "Teacher",
      ),
    );

    return Promise.resolve({
      score: teachers && teachers.length > 0 ? 5 : 0,
      note:
        teachers && teachers.length > 0
          ? "School has teachers listed."
          : "School does not have teachers listed.",
    });
  },
};
