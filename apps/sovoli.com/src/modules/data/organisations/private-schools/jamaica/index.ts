import type { OrgInstance } from "~/modules/organisations/types";
import { MANCHESTER_PRIVATE_SCHOOLS_JAMAICA } from "./manchester";
import { ST_ELIZABETH_PRIVATE_SCHOOLS_JAMAICA } from "./st-elizabeth";
import { ST_JAMES_PRIVATE_SCHOOLS } from "./st-james";
import { WESTMORELAND_PRIVATE_SCHOOLS_JAMAICA } from "./westmoreland";

export const PRIVATE_SCHOOLS_JAMAICA: OrgInstance[] = [
  ...MANCHESTER_PRIVATE_SCHOOLS_JAMAICA,
  ...ST_ELIZABETH_PRIVATE_SCHOOLS_JAMAICA,
  ...ST_JAMES_PRIVATE_SCHOOLS,
  ...WESTMORELAND_PRIVATE_SCHOOLS_JAMAICA,
];
