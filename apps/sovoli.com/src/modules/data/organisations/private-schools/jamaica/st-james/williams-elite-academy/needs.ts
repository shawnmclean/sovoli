import { parseNeedsModule } from "~/modules/data/organisations/utils/parseNeedsModule";
import type { NeedsModule } from "~/modules/needs/types";
import needsData from "./needs.json";

export const WILLIAMS_ELITE_ACADEMY_NEEDS: NeedsModule =
  parseNeedsModule(needsData);
