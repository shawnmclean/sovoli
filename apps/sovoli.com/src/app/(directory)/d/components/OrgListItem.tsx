import type { OrgInstance } from "~/modules/organisations/types";
import { PrivateSchoolListItem } from "./PrivateSchoolListItem";

export function OrgListItem({ orgInstance }: { orgInstance: OrgInstance }) {
  if (
    orgInstance.org.categories.includes("private-school") ||
    orgInstance.org.categories.includes("public-school")
  ) {
    return <PrivateSchoolListItem orgInstance={orgInstance} />;
  }
  return <div>{orgInstance.org.name}</div>;
}
