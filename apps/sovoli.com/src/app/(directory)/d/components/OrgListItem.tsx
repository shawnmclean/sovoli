import type { OrgInstance } from "~/modules/organisations/types";
import { PrivateSchoolListItem } from "./PrivateSchoolListItem";
import { orgCategoriesIncludeGroup } from "~/modules/organisations/lib/categoryHierarchy";

export function OrgListItem({ orgInstance }: { orgInstance: OrgInstance }) {
  if (orgCategoriesIncludeGroup(orgInstance.org.categories, "school")) {
    return <PrivateSchoolListItem orgInstance={orgInstance} />;
  }

  return <div>{orgInstance.org.name}</div>;
}
