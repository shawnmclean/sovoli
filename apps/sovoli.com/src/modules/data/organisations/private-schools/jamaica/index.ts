import type { OrgInstance } from "~/modules/organisations/types";
import { MANCHESTER_PRIVATE_SCHOOLS_JAMAICA } from "./manchester";
import { ST_ELIZABETH_PRIVATE_SCHOOLS_JAMAICA } from "./st-elizabeth";

export const PRIVATE_SCHOOLS_JAMAICA: OrgInstance[] = [
  ...MANCHESTER_PRIVATE_SCHOOLS_JAMAICA,
  ...ST_ELIZABETH_PRIVATE_SCHOOLS_JAMAICA,
];
