import type { WorkforceMember } from "../types";

export function getUniqueDepartmentNames(members: WorkforceMember[]): string[] {
  const departments = new Set<string>();
  members.forEach((member) => {
    member.roleAssignments.forEach((assignment) => {
      if (assignment.department) departments.add(assignment.department.name);
    });
  });
  return Array.from(departments).sort((a, b) => a.localeCompare(b));
}

