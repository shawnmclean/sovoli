import type { NeedsModule } from "~/modules/needs/types";
import { parseNeedsModule } from "~/modules/data/organisations/utils/parseNeedsModule";
import needsData from "./needs.json";

export const ST_THERESA_BASIC_SCHOOL_NEEDS: NeedsModule = parseNeedsModule(needsData);

