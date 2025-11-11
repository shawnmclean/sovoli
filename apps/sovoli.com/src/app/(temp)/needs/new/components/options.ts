export const ORG_TYPE_OPTIONS = [
  { key: "public-primary", label: "Public Primary School" },
  { key: "public-secondary", label: "Public Secondary / High School" },
  { key: "private-primary", label: "Private Primary School" },
  { key: "private-secondary", label: "Private Secondary / High School" },
  { key: "basic-infant", label: "Basic / Infant School" },
  { key: "tertiary", label: "Tertiary / College" },
  { key: "special-education", label: "Special Education Institution" },
  { key: "stationary", label: "Stationary" },
  { key: "other", label: "Other Organisation Type" },
] as const;

export const CONTACT_ROLE_OPTIONS = [
  { key: "principal", label: "Principal" },
  { key: "vice-principal", label: "Vice Principal" },
  { key: "administrator", label: "Administrator" },
  { key: "guidance-counsellor", label: "Guidance Counsellor" },
  { key: "teacher", label: "Teacher" },
  { key: "board-member", label: "Board Member" },
  { key: "operations", label: "Operations / Facilities Lead" },
  { key: "other", label: "Other" },
] as const;

export type OrgTypeOptionKey = (typeof ORG_TYPE_OPTIONS)[number]["key"];
export type ContactRoleOptionKey = (typeof CONTACT_ROLE_OPTIONS)[number]["key"];
