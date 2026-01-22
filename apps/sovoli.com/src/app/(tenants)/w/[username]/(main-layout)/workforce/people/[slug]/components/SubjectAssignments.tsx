import type { SubjectAssignment } from "~/modules/workforce/types";
import { groupSubjectAssignmentsByGrade } from "~/modules/workforce/utils";

interface SubjectAssignmentsProps {
  assignments: SubjectAssignment[];
}

export function SubjectAssignments({ assignments }: SubjectAssignmentsProps) {
  if (assignments.length === 0) return null;

  const gradeSubjectsMap = groupSubjectAssignmentsByGrade(assignments);

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
