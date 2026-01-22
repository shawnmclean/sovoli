import { parseNeedsModule } from "~/modules/data/organisations/utils/parseNeedsModule";
import type { NeedsModule } from "~/modules/needs/types";
import needsData from "./needs.json";

export const JABNEH_CHRISTIAN_ACADEMY_NEEDS: NeedsModule =
  parseNeedsModule(needsData);
