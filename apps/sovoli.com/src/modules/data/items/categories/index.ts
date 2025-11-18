import artsCraftsNeedleworkData from "./artsCraftsNeedlework.json";
import audioVisualPhotographyData from "./audioVisualPhotography.json";
import beautyPersonalCareHygieneData from "./beautyPersonalCareHygiene.json";
import buildingProductsData from "./buildingProducts.json";
import campingData from "./camping.json";
import cleaningHygieneProductsData from "./cleaningHygieneProducts.json";
import clothingData from "./clothing.json";
import communicationsData from "./communications.json";
import computingData from "./computing.json";
import cropsData from "./crops.json";
import crossSegmentData from "./crossSegment.json";
import electricalSuppliesData from "./electricalSupplies.json";
import fluidsFuelsGasesData from "./fluidsFuelsGases.json";
import foodBeverageData from "./foodBeverage.json";
import footwearData from "./footwear.json";
import healthcareData from "./healthcare.json";
import homeAppliancesData from "./homeAppliances.json";
import horticulturePlantsData from "./horticulturePlants.json";
import householdOfficeFurnitureFurnishingsData from "./householdOfficeFurnitureFurnishings.json";
import industrialFluidPumpsSystemsData from "./industrialFluidPumpsSystems.json";
import kitchenwareAndTablewareData from "./kitchenwareAndTableware.json";
import lawnGardenSuppliesData from "./lawnGardenSupplies.json";
import lightingData from "./lighting.json";
import liveAnimalsData from "./liveAnimals.json";
import lubricantsData from "./lubricants.json";
import monetaryAssetsData from "./monetaryAssets.json";
import musicData from "./music.json";
import personalAccessoriesData from "./personalAccessories.json";
import pestPlantControlProductsData from "./pestPlantControlProducts.json";
import petCareFoodData from "./petCareFood.json";
import plumbingHeatingVentilationAirConditioningData from "./plumbingHeatingVentilationAirConditioning.json";
import postmortemProductsData from "./postmortemProducts.json";
import rawMaterialsNonFoodData from "./rawMaterialsNonFood.json";
import safetyProtectionDiyData from "./safetyProtectionDiy.json";
import safetySecuritySurveillanceData from "./safetySecuritySurveillance.json";
import servicesVendingMachinesData from "./servicesVendingMachines.json";
import sportsEquipmentData from "./sportsEquipment.json";
import stationeryOfficeMachineryOccasionSuppliesData from "./stationeryOfficeMachineryOccasionSupplies.json";
import storageHaulageContainersData from "./storageHaulageContainers.json";
import textualPrintedReferenceMaterialsData from "./textualPrintedReferenceMaterials.json";
import tobaccoCannabisData from "./tobaccoCannabis.json";
import toolStorageWorkshopAidsData from "./toolStorageWorkshopAids.json";
import toolsEquipmentData from "./toolsEquipment.json";
import toysGamesData from "./toysGames.json";
import vehicleData from "./vehicle.json";

import type { CategoryDefinition } from "~/modules/core/items/types";
import { categoryDefinitionSchema } from "~/modules/core/items/types";

const categoryData = [
  artsCraftsNeedleworkData,
  audioVisualPhotographyData,
  beautyPersonalCareHygieneData,
  buildingProductsData,
  campingData,
  cleaningHygieneProductsData,
  clothingData,
  communicationsData,
  computingData,
  cropsData,
  crossSegmentData,
  electricalSuppliesData,
  fluidsFuelsGasesData,
  foodBeverageData,
  footwearData,
  healthcareData,
  homeAppliancesData,
  horticulturePlantsData,
  householdOfficeFurnitureFurnishingsData,
  industrialFluidPumpsSystemsData,
  kitchenwareAndTablewareData,
  lawnGardenSuppliesData,
  lightingData,
  liveAnimalsData,
  lubricantsData,
  monetaryAssetsData,
  musicData,
  personalAccessoriesData,
  pestPlantControlProductsData,
  petCareFoodData,
  plumbingHeatingVentilationAirConditioningData,
  postmortemProductsData,
  rawMaterialsNonFoodData,
  safetyProtectionDiyData,
  safetySecuritySurveillanceData,
  servicesVendingMachinesData,
  sportsEquipmentData,
  stationeryOfficeMachineryOccasionSuppliesData,
  storageHaulageContainersData,
  textualPrintedReferenceMaterialsData,
  tobaccoCannabisData,
  toolStorageWorkshopAidsData,
  toolsEquipmentData,
  toysGamesData,
  vehicleData,
] as const;

export const ITEM_CATEGORY_TREE: CategoryDefinition[] = categoryDefinitionSchema
  .array()
  .parse(categoryData);
