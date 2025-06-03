import type { Org } from "~/modules/organisations/types";
import type { Website } from "~/modules/websites/types";
import { MODERN_ACADEMY_ORG } from "./magy/org";
import { MODERN_ACADEMY_WEBSITE } from "./magy/website";

export const ORGS: { org: Org; website?: Website }[] = [
  {
    org: MODERN_ACADEMY_ORG,
    website: MODERN_ACADEMY_WEBSITE,
  },
];
