import { parseNeedsModule } from "~/modules/data/organisations/utils/parseNeedsModule";
import type { NeedsModule } from "~/modules/needs/types";
import needsData from "./needs.json";

export const COVE_PRIMARY_NEEDS: NeedsModule = parseNeedsModule(needsData);
