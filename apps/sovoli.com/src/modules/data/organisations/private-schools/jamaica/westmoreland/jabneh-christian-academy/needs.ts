import type { NeedsModule } from "~/modules/needs/types";
import { parseNeedsModule } from "~/modules/data/organisations/utils/parseNeedsModule";
import needsData from "./needs.json";

export const JABNEH_CHRISTIAN_ACADEMY_NEEDS: NeedsModule = parseNeedsModule(needsData);

