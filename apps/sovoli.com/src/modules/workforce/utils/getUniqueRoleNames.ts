import type { WorkforceMember } from "../types";

export function getUniqueRoleNames(members: WorkforceMember[]): string[] {
  const roles = new Set<string>();
  members.forEach((member) => {
    member.roleAssignments.forEach((assignment) => {
      roles.add(assignment.position.name);
    });
  });
  return Array.from(roles).sort((a, b) => a.localeCompare(b));
}
