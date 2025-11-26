import { z } from "zod";
import { findItemById } from "~/modules/data/items";
import type { NeedsModule, MaterialNeed } from "~/modules/needs/types";

/**
 * Zod schema for JSON representation of a material need (with itemId instead of item object)
 */
const materialNeedJsonSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  itemId: z.string(), // Foreign key reference to item
  quantity: z.number().optional(),
  type: z.literal("material"),
  source: z.enum(["internal", "external"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  neededBy: z
    .union([
      z.object({
        type: z.literal("deadline"),
        date: z.string(),
      }),
      z.object({
        type: z.literal("asap"),
        requestedAt: z.string().optional(),
        reason: z.string().optional(),
      }),
    ])
    .optional(),
  window: z
    .object({
      start: z.string(),
      end: z.string().optional(),
    })
    .optional(),
  requestingUnit: z
    .object({
      locationKey: z.string().optional(),
    })
    .optional(),
  status: z
    .enum([
      "planned",
      "awaiting-approval",
      "approved",
      "ordered",
      "fulfilled",
      "cancelled",
      "in-progress",
      "hiring",
    ])
    .optional(),
  projectId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Zod schema for the needs JSON file structure
 */
const needsModuleJsonSchema = z.object({
  needs: z.array(materialNeedJsonSchema),
});

/**
 * Parses a needs JSON file and resolves foreign key references to Item objects.
 * Validates that all referenced items exist.
 *
 * @param jsonData - The parsed JSON data from the needs.json file
 * @returns Fully hydrated NeedsModule with Item objects resolved
 * @throws Error if any itemId cannot be resolved or if JSON structure is invalid
 */
export function parseNeedsModule(jsonData: unknown): NeedsModule {
  // Validate JSON structure
  const validated = needsModuleJsonSchema.parse(jsonData);

  // Resolve itemId references and validate they exist
  const needs: MaterialNeed[] = validated.needs.map((needJson) => {
    const item = findItemById(needJson.itemId);
    if (!item) {
      throw new Error(
        `Item with id "${needJson.itemId}" not found. Referenced in need "${needJson.slug}" (${needJson.title}).`,
      );
    }

    // Build the hydrated need object
    const need: MaterialNeed = {
      slug: needJson.slug,
      title: needJson.title,
      description: needJson.description,
      item,
      quantity: needJson.quantity,
      type: "material",
      source: needJson.source,
      priority: needJson.priority,
      neededBy: needJson.neededBy,
      window: needJson.window,
      requestingUnit: needJson.requestingUnit,
      status: needJson.status,
      projectId: needJson.projectId,
      notes: needJson.notes,
      createdAt: needJson.createdAt,
      updatedAt: needJson.updatedAt,
    };

    return need;
  });

  return {
    needs,
  };
}
