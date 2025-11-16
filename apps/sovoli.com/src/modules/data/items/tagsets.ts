import type { Item, ItemTagSet } from "~/modules/core/items/types";
import { findItemById } from ".";

export const TAGSET_ROOF_REPAIR: ItemTagSet = {
  id: "roof-repair",
  name: "Roof Repair",
  description:
    "Materials required for temporary or permanent building roof restoration.",
  items: [
    findItemById("maintenance-plyboard"),
    findItemById("maintenance-zinc-roof-sheet"),
    findItemById("relief-roof-sealant"),
    findItemById("relief-screws"),
    findItemById("relief-basic-hand-tools"),
    findItemById("relief-tarpaulin-heavy-duty"),
  ].filter((i): i is Item => i !== undefined),
};

export const TAGSET_LIST = [TAGSET_ROOF_REPAIR];
