export const ORG_TYPE_OPTIONS = [
  { key: "public-basic", label: "Public Basic School" },
  { key: "private-basic", label: "Private Basic School" },
  { key: "public-primary", label: "Public Primary School" },
  { key: "private-primary", label: "Private Primary School" },
  { key: "public-secondary", label: "Public Secondary School" },
  { key: "private-secondary", label: "Private Secondary School" },
  { key: "tertiary", label: "Tertiary / College" },
  { key: "special-education", label: "Special Education Institution" },
  { key: "stationery", label: "Stationery" },
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

export const PARISH_OPTIONS = [
  { key: "kingston", label: "Kingston" },
  { key: "st-andrew", label: "St. Andrew" },
  { key: "st-catherine", label: "St. Catherine" },
  { key: "clarendon", label: "Clarendon" },
  { key: "manchester", label: "Manchester" },
  { key: "st-elizabeth", label: "St. Elizabeth" },
  { key: "westmoreland", label: "Westmoreland" },
  { key: "hanover", label: "Hanover" },
  { key: "st-james", label: "St. James" },
  { key: "trelawny", label: "Trelawny" },
  { key: "st-ann", label: "St. Ann" },
  { key: "st-mary", label: "St. Mary" },
  { key: "portland", label: "Portland" },
  { key: "st-thomas", label: "St. Thomas" },
] as const;

export const SEVERITY_OPTIONS = [
  {
    key: "minor",
    label: "Minor",
    description: "Roof leaking, loss of books, etc",
  },
  {
    key: "moderate",
    label: "Moderate",
    description: "Partial roof damage and structure",
  },
  {
    key: "severe",
    label: "Severe",
    description: "Complete roof damage, multiple buildings, etc",
  },
  {
    key: "critical",
    label: "Critical",
    description: "Flattened, complete devastation",
  },
] as const;

export type OrgTypeOptionKey = (typeof ORG_TYPE_OPTIONS)[number]["key"];
export type ContactRoleOptionKey = (typeof CONTACT_ROLE_OPTIONS)[number]["key"];
export type ParishOptionKey = (typeof PARISH_OPTIONS)[number]["key"];
export type SeverityOptionKey = (typeof SEVERITY_OPTIONS)[number]["key"];
