import type { CatalogModule, CatalogOffer } from "~/modules/catalogs/types";
import { findItemById } from "~/modules/data/items";
import type { AmountByCurrency } from "~/modules/core/economics/types";

/**
 * Helper function to create a catalog item with pricing
 */
function createCatalogItem(
  id: string,
  price: AmountByCurrency,
  name?: string,
): CatalogOffer | null {
  const item = findItemById(id);
  if (!item) {
    console.warn(`Item with id "${id}" not found`);
    return null;
  }

  return {
    id,
    item,
    price,
    name,
  };
}

export const MONGOLS_BUILDERS_DEPOT_CATALOG: CatalogModule = {
  items: [
    // Nails
    createCatalogItem("nail-head-1in", { JMD: 242 }, "Nail Head 1\""),
    createCatalogItem("nail-head-2-5in", { JMD: 935 }, "Nail Head 2 1/2\""),
    createCatalogItem("nail-head-3in", { JMD: 484 }, "Nail Head 3\""),
    createCatalogItem("nail-zinc-2-5in", { JMD: 1085 }, "Nail Zinc 2 1/2\""),
    createCatalogItem("nail-concrete-2-5in", { JMD: 1878 }, "Nail Conc 2 1/2\""),

    // Plumbing Fixtures
    createCatalogItem("tank-to-bowl-screw", { JMD: 435 }, "Tank To Bowl Screw"),
    createCatalogItem("basin-faucet-single-lever", { JMD: 829 }, "Flex Speed Basin"),
    createCatalogItem("toilet-faucet", { JMD: 743 }, "Flex Speed Toilet"),
    createCatalogItem("hose-bib-1-2in-pvc", { JMD: 400 }, "Pipe Cock/ Hose Bib 1/2\" PVC"),
    createCatalogItem("angle-valve-1-2x3-8", { JMD: 3348 }, "Angle Valve 1/2x 3/8"),
    createCatalogItem("s-trap-1-5in", { JMD: 1456 }, "S-Trap 1 1/2\""),
    createCatalogItem("toilet-inlet-valve", { JMD: 1657 }, "Inlet Valve Toilet"),
    createCatalogItem("toilet-flapper-ball", { JMD: 497 }, "Flapper Ball"),
    createCatalogItem("toilet-flush-handle-metal", { JMD: 717 }, "Flush Handle Metal"),
    createCatalogItem("basin-faucet-mixer-single-lever", { JMD: 9137 }, "Mixer Basin Single Lever"),
    createCatalogItem("valve-outlet", { JMD: 1015 }, "Valve Outlet"),

    // Electrical Items
    createCatalogItem("circuit-breaker-20amp-double-pole", { JMD: 3105 }, "Breaker 20Amp DP"),
    createCatalogItem("led-emergency-bulb-11w", { JMD: 3105 }, "Bulb LED Emergency Intelligent 11W"),
    createCatalogItem("electrical-tape-multi-color", { JMD: 1050 }, "Tape Electrical yellow blue red green"),

    // Lumber
    createCatalogItem("lumber-1x3x16-rough-untreated", { JMD: 1079 }, "1x3x16 ROUGH UNTREATED"),
    createCatalogItem("lumber-1x6x16-dress-treated", { JMD: 2700 }, "1x6x16 DRESS TREATED 14/3/25"),
    createCatalogItem("lumber-1x6x14-gt", { JMD: 3770 }, "1x6x14 GT"),
    createCatalogItem("lumber-1x8x16-dress-treated", { JMD: 4561 }, "1x8x16 DRESS TREATED 14/3/25"),

    // Roofing Materials
    createCatalogItem("strip-flat-12ft", { JMD: 11007 }, "Strip Flat 12ft"),
    createCatalogItem("strip-flat-14ft", { JMD: 803 }, "Strip Flat 14ft"),
    createCatalogItem("zinc-aluminum-8ft", { JMD: 2232 }, "Zinc Alu 8ft"),
    createCatalogItem("zinc-aluminum-12ft", { JMD: 3240 }, "Zinc Alu 12ft"),
    createCatalogItem("cellotex-hardboard", { JMD: 1716 }, "Cellotex Hardboard"),

    // Doors
    createCatalogItem("door-metal-36x80", { JMD: 18750 }, "Door Metal 36\" x80\" (Raised Panel)"),
    createCatalogItem("door-ply-32x80", { JMD: 7391 }, "Door Ply 32\" x80\""),

    // Hardware
    createCatalogItem("fillet", { JMD: 1826 }, "Fillets"),
    createCatalogItem("screw-zinc-2in", { JMD: 28 }, "Screw Zinc Large 2\""),
    createCatalogItem("lock-deadbolt-single-key", { JMD: 2601 }, "Lock Deadbolt - Single key"),
    createCatalogItem("lock-entrance-single-turn", { JMD: 2790 }, "Lock Entrance - Single Turn"),
  ].filter((item): item is CatalogOffer => item !== null),
};

