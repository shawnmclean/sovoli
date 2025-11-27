import type { Item } from "~/modules/core/items/types";
import { itemJsonSchema } from "~/modules/core/items/types";
import { hydrateCategory } from "./categories";
import plumbingHeatingVentilationAirConditioningData from "./library/plumbingHeatingVentilationAirConditioning.json";
import workbooksData from "./library/textualPrintedReferenceMaterials/workbooks.json";
import readersData from "./library/textualPrintedReferenceMaterials/readers.json";
import textbooksData from "./library/textualPrintedReferenceMaterials/textbooks.json";
import referencesData from "./library/textualPrintedReferenceMaterials/references.json";
import roofingData from "./library/buildingProducts/roofing.json";
import fastenersData from "./library/buildingProducts/fasteners.json";
import lumberData from "./library/buildingProducts/lumber.json";
import adhesivesSealantsData from "./library/buildingProducts/adhesivesSealants.json";
import hardwareData from "./library/buildingProducts/hardware.json";
import gypsumDrywallData from "./library/buildingProducts/gypsumDrywall.json";
import handToolsData from "./library/toolsEquipment/handTools.json";
import cuttingToolsData from "./library/toolsEquipment/cuttingTools.json";
import powerToolsData from "./library/toolsEquipment/powerTools.json";
import artSuppliesData from "./library/artsCraftsNeedlework/artSupplies.json";
import educationalToysData from "./library/toysGames/educationalToys.json";
import pencilsData from "./library/stationeryOfficeMachineryOccasionSupplies/pencils.json";
import exerciseBooksData from "./library/stationeryOfficeMachineryOccasionSupplies/exerciseBooks.json";

// Parse and hydrate items from JSON files
function hydrateItemsFromJson(jsonData: unknown[]): Item[] {
  const parsedItems = itemJsonSchema.array().parse(jsonData);
  return parsedItems.map((item) => ({
    ...item,
    category: hydrateCategory(item.category),
  }));
}

const PLUMBING_HEATING_VENTILATION_AIR_CONDITIONING_ITEMS =
  hydrateItemsFromJson(plumbingHeatingVentilationAirConditioningData);

const BOOKS = [
  ...hydrateItemsFromJson(workbooksData),
  ...hydrateItemsFromJson(readersData),
  ...hydrateItemsFromJson(textbooksData),
  ...hydrateItemsFromJson(referencesData),
];

const HARDWARE_ITEMS = [
  ...hydrateItemsFromJson(roofingData),
  ...hydrateItemsFromJson(fastenersData),
  ...hydrateItemsFromJson(lumberData),
  ...hydrateItemsFromJson(adhesivesSealantsData),
  ...hydrateItemsFromJson(hardwareData),
  ...hydrateItemsFromJson(gypsumDrywallData),
  ...hydrateItemsFromJson(handToolsData),
  ...hydrateItemsFromJson(cuttingToolsData),
  ...hydrateItemsFromJson(powerToolsData),
];

const ARTS_CRAFTS_ITEMS = [...hydrateItemsFromJson(artSuppliesData)];

const TOYS_GAMES_ITEMS = [...hydrateItemsFromJson(educationalToysData)];

const STATIONERY_ITEMS = [
  ...hydrateItemsFromJson(pencilsData),
  ...hydrateItemsFromJson(exerciseBooksData),
];

export const ALL_ITEMS: Item[] = [
  ...BOOKS,
  ...PLUMBING_HEATING_VENTILATION_AIR_CONDITIONING_ITEMS,
  ...HARDWARE_ITEMS,
  ...ARTS_CRAFTS_ITEMS,
  ...TOYS_GAMES_ITEMS,
  ...STATIONERY_ITEMS,
  // ...BUILDING_ITEMS,
  // ...HYGIENE_ITEMS,
  // ...EQUIPMENT_ITEMS,
  // ...FOOD_ITEMS,
  // ...OTHER_ITEMS,
];

export function findItemById(id: string): Item | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

export function findItemsByIds(ids: string[]): Item[] {
  return ALL_ITEMS.filter((item) => ids.includes(item.id));
}
