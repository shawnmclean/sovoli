import type { OrgRoleAssignment, WorkforceMember } from "../types";

/**
 * Returns the "primary" role assignment for a member.
 * Falls back to the first assignment if none is marked `isPrimary`.
 */
export function getPrimaryRoleAssignment(
  member: WorkforceMember,
): OrgRoleAssignment | undefined {
  return (
    member.roleAssignments.find((r) => r.isPrimary) ?? member.roleAssignments[0]
  );
}
