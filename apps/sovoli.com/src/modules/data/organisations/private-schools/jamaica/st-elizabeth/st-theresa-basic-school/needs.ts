import { parseNeedsModule } from "~/modules/data/organisations/utils/parseNeedsModule";
import type { NeedsModule } from "~/modules/needs/types";
import needsData from "./needs.json";

export const ST_THERESA_BASIC_SCHOOL_NEEDS: NeedsModule =
  parseNeedsModule(needsData);
