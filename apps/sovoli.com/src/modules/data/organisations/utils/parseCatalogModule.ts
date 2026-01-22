import { z } from "zod";
import type { CatalogModule, CatalogOffer } from "~/modules/catalogs/types";
import type { AmountByCurrency } from "~/modules/core/economics/types";
import { findItemById } from "~/modules/data/items";

/**
 * Zod schema for AmountByCurrency (partial record - all fields optional)
 * Matches TypeScript type: Partial<Record<CurrencyCode, number>>
 */
const amountByCurrencySchema = z
  .object({
    GYD: z.number().optional(),
    USD: z.number().optional(),
    JMD: z.number().optional(),
  })
  .strict();

/**
 * Zod schema for JSON representation of a catalog offer (with itemId instead of item object)
 */
const catalogOfferJsonSchema = z.object({
  id: z.string(), // itemId - foreign key reference to item
  name: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  price: amountByCurrencySchema,
});

/**
 * Zod schema for catalog.json file structure
 */
const catalogModuleJsonSchema = z.object({
  items: z.array(catalogOfferJsonSchema),
});

/**
 * Parses a catalog.json file and resolves foreign key references to Item objects.
 * Validates that all referenced items exist.
 *
 * @param jsonData - The parsed JSON data from the catalog.json file
 * @returns Fully hydrated CatalogModule with Item objects resolved
 * @throws Error if any itemId cannot be resolved or if JSON structure is invalid
 */
export function parseCatalogModule(jsonData: unknown): CatalogModule {
  // Validate JSON structure
  const validated = catalogModuleJsonSchema.parse(jsonData);

  // Resolve itemId references and validate they exist
  const items: CatalogOffer[] = validated.items
    .map((offerJson) => {
      const item = findItemById(offerJson.id);
      if (!item) {
        throw new Error(
          `Item with id "${offerJson.id}" not found. Referenced in catalog.`,
        );
      }

      // Build the hydrated catalog offer object
      const offer: CatalogOffer = {
        id: offerJson.id,
        item,
        name: offerJson.name,
        attributes: offerJson.attributes,
        price: offerJson.price as AmountByCurrency,
      };

      return offer;
    })
    .filter((offer): offer is CatalogOffer => offer !== null);

  return {
    items,
  };
}
