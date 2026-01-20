import type { WorkforceMember } from "../types";

export type PublicContactType = "email" | "phone";

/**
 * Returns the value for a public contact (email/phone) or null.
 */
export function getPublicContactValue(
  member: WorkforceMember,
  type: PublicContactType,
): string | null {
  return (
    member.contacts?.find((c) => c.type === type && c.isPublic)?.value ?? null
  );
}

