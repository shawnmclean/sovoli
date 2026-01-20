import type { WorkforceMember } from "../types";
import { getPrimaryRoleAssignment } from "./getPrimaryRoleAssignment";

/**
 * Returns the best display title for a member (titleOverride -> position name).
 */
export function getMemberDisplayTitle(
  member: WorkforceMember,
): string | undefined {
  const primaryRole = getPrimaryRoleAssignment(member);
  return primaryRole?.titleOverride ?? primaryRole?.position.name;
}

