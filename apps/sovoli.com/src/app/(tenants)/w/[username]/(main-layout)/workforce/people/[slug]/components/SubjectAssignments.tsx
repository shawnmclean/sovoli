import React from "react";
import type { SubjectAssignment } from "~/modules/workforce/types";

interface SubjectAssignmentsProps {
  assignments: SubjectAssignment[];
}

function getGradeSubjectsMap(assignments: SubjectAssignment[]) {
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

export function SubjectAssignments({ assignments }: SubjectAssignmentsProps) {
  if (assignments.length === 0) return null;

  const gradeSubjectsMap = getGradeSubjectsMap(assignments);

  return (
    <ul className="list-disc list-inside space-y-1 text-default-600">
      {Array.from(gradeSubjectsMap.entries()).map(([grade, subjects]) => (
        <li key={grade}>
          <span className="font-medium text-default-700">{grade}:</span>{" "}
          <span className="text-default-600">{subjects.join(", ")}</span>
        </li>
      ))}
    </ul>
  );
}
