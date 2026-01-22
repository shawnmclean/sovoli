import type { SubjectAssignment } from "../types";

export function groupSubjectAssignmentsByGrade(
  assignments: SubjectAssignment[],
): Map<string, string[]> {
  const gradeSubjectsMap = new Map<string, string[]>();

  assignments.forEach((assignment) => {
    assignment.grades.forEach((grade) => {
      if (!gradeSubjectsMap.has(grade)) {
        gradeSubjectsMap.set(grade, []);
      }
      gradeSubjectsMap.get(grade)?.push(assignment.subject);
    });
  });

  return gradeSubjectsMap;
}
