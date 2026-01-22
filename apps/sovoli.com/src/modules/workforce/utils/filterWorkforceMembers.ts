import type { WorkforceMember } from "../types";
import { getPublicContactValue } from "./getPublicContactValue";

export interface FilterWorkforceMembersOptions {
  members: WorkforceMember[];
  searchQuery?: string;
  selectedRole?: string;
  selectedDepartment?: string;
}

export function filterWorkforceMembers(
  options: FilterWorkforceMembersOptions,
): WorkforceMember[] {
  const {
    members,
    searchQuery = "",
    selectedRole = "",
    selectedDepartment = "",
  } = options;

  const q = searchQuery.trim().toLowerCase();

  return members.filter((member) => {
    const email = getPublicContactValue(member, "email");
    const bio = member.bio ?? "";

    const matchesSearch =
      q.length === 0 ||
      member.name.toLowerCase().includes(q) ||
      (email?.toLowerCase().includes(q) ?? false) ||
      bio.toLowerCase().includes(q);

    const matchesRole = selectedRole
      ? member.roleAssignments.some((r) => r.position.name === selectedRole)
      : true;

    const matchesDepartment = selectedDepartment
      ? member.roleAssignments.some(
          (r) => r.department?.name === selectedDepartment,
        )
      : true;

    return matchesSearch && matchesRole && matchesDepartment;
  });
}
