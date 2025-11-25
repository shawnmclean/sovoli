import type { OrgInstance } from "~/modules/organisations/types";

import { HANOVER_PUBLIC_SCHOOLS_JAMAICA } from "./hanover";
import { ST_ELIZABETH_PUBLIC_SCHOOLS_JAMAICA } from "./st-elizabeth";

export const PUBLIC_SCHOOLS_JAMAICA: OrgInstance[] = [
  ...HANOVER_PUBLIC_SCHOOLS_JAMAICA,
  ...ST_ELIZABETH_PUBLIC_SCHOOLS_JAMAICA,
];
