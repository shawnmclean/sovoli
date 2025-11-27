import type { NeedsModule } from "~/modules/needs/types";
import { parseNeedsModule } from "~/modules/data/organisations/utils/parseNeedsModule";
import needsData from "./needs.json";

export const WILLIAMS_ELITE_ACADEMY_NEEDS: NeedsModule = parseNeedsModule(needsData);

