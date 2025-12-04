import { z } from "zod";
import { findItemById } from "~/modules/data/items";
import type {
  NeedsModule,
  MaterialNeed,
  HumanNeed,
  ServiceNeed,
  FinancialNeed,
  JobNeed,
  Need,
} from "~/modules/needs/types";
import type { AmountByCurrency } from "~/modules/core/economics/types";
import type { WorkforceModule } from "~/modules/workforce/types";

/**
 * Zod schema for NeedFulfillment
 */
const needFulfillmentSchema = z
  .object({
    quantityMet: z.number().optional(),
    amountRaised: z.record(z.enum(["GYD", "USD", "JMD"]), z.number()).optional(),
    progress: z.number().optional(),
  })
  .optional();

/**
 * Shared schema for common need fields
 */
const needBaseJsonSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  quantity: z.number().optional(),
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
  procurement: z
    .object({
      supplier: z.string().optional(),
      estimatedCost: z.number().optional(),
      currency: z.enum(["GYD", "USD", "JMD"]).optional(),
      status: z
        .enum(["quoted", "ordered", "delivered", "cancelled"])
        .optional(),
      notes: z.string().optional(),
    })
    .optional(),
  fulfillment: needFulfillmentSchema,
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  totalBudget: z.record(z.enum(["GYD", "USD", "JMD"]), z.number()).optional(),
});

/**
 * Zod schema for AmountByCurrency
 */
const amountByCurrencySchema = z
  .record(z.enum(["GYD", "USD", "JMD"]), z.number())
  .optional();

/**
 * Zod schema for JSON representation of a material need (with itemId instead of item object)
 */
const materialNeedJsonSchema = needBaseJsonSchema.extend({
  itemId: z.string(), // Foreign key reference to item
  type: z.literal("material"),
});

/**
 * Zod schema for JSON representation of a human need
 */
const humanNeedJsonSchema = needBaseJsonSchema.extend({
  type: z.literal("human"),
  roleSummary: z.string().optional(),
  headcount: z.number().optional(),
  shiftPattern: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

/**
 * Zod schema for JSON representation of a service need
 */
const serviceNeedJsonSchema = needBaseJsonSchema.extend({
  type: z.literal("service"),
  serviceCategory: z.string().optional(),
  statementOfWork: z.array(z.string()).optional(),
  rfpUrl: z.string().optional(),
  bidsCloseAt: z.string().optional(),
});

/**
 * Zod schema for JSON representation of a financial need
 */
const financialNeedJsonSchema = needBaseJsonSchema.extend({
  type: z.literal("financial"),
  targetAmount: amountByCurrencySchema,
  pledgeUrl: z.string().optional(),
});

/**
 * Zod schema for JSON representation of a job need
 * Note: position is optional in JSON as it may need to be resolved from workforce module
 */
const jobNeedJsonSchema = needBaseJsonSchema.extend({
  type: z.literal("job"),
  positionSlug: z.string().optional(), // Foreign key reference to position slug
});

/**
 * Union schema for all need types
 */
const needJsonSchema = z.discriminatedUnion("type", [
  materialNeedJsonSchema,
  humanNeedJsonSchema,
  serviceNeedJsonSchema,
  financialNeedJsonSchema,
  jobNeedJsonSchema,
]);

/**
 * Zod schema for the needs JSON file structure
 */
const needsModuleJsonSchema = z.object({
  needs: z.array(needJsonSchema),
});

/**
 * Parses a needs JSON file and resolves foreign key references.
 * Validates that all referenced items exist.
 *
 * @param jsonData - The parsed JSON data from the needs.json file
 * @param options - Optional options object containing workforce module for resolving job need positions
 * @returns Fully hydrated NeedsModule with all references resolved
 * @throws Error if any itemId or positionSlug cannot be resolved or if JSON structure is invalid
 */
export function parseNeedsModule(
  jsonData: unknown,
  options?: { workforceModule?: WorkforceModule | null },
): NeedsModule {
  // Validate JSON structure
  const validated = needsModuleJsonSchema.parse(jsonData);

  // Resolve references and build hydrated need objects
  const needs: Need[] = validated.needs.map((needJson) => {
    const baseFields = {
      slug: needJson.slug,
      title: needJson.title,
      description: needJson.description,
      quantity: needJson.quantity,
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
      procurement: needJson.procurement,
      fulfillment: needJson.fulfillment as {
        quantityMet?: number;
        amountRaised?: AmountByCurrency;
        progress?: number;
      } | undefined,
      totalBudget: needJson.totalBudget as AmountByCurrency | undefined,
    };

    switch (needJson.type) {
      case "material": {
        const item = findItemById(needJson.itemId);
        if (!item) {
          throw new Error(
            `Item with id "${needJson.itemId}" not found. Referenced in need "${needJson.slug}" (${needJson.title}).`,
          );
        }

        const need: MaterialNeed = {
          ...baseFields,
          type: "material",
          item,
        };
        return need;
      }

      case "human": {
        const need: HumanNeed = {
          ...baseFields,
          type: "human",
          roleSummary: needJson.roleSummary,
          headcount: needJson.headcount,
          shiftPattern: needJson.shiftPattern,
          skills: needJson.skills,
        };
        return need;
      }

      case "service": {
        const need: ServiceNeed = {
          ...baseFields,
          type: "service",
          serviceCategory: needJson.serviceCategory,
          statementOfWork: needJson.statementOfWork,
          rfpUrl: needJson.rfpUrl,
          bidsCloseAt: needJson.bidsCloseAt,
        };
        return need;
      }

      case "financial": {
        const need: FinancialNeed = {
          ...baseFields,
          type: "financial",
          targetAmount: needJson.targetAmount as AmountByCurrency | undefined,
          pledgeUrl: needJson.pledgeUrl,
        };
        return need;
      }

      case "job": {
        let position;
        if (needJson.positionSlug && options?.workforceModule?.positions) {
          position = options.workforceModule.positions.find(
            (p) => p.slug === needJson.positionSlug,
          );
          if (!position) {
            throw new Error(
              `Position with slug "${needJson.positionSlug}" not found. Referenced in need "${needJson.slug}" (${needJson.title}).`,
            );
          }
        }

        const need: JobNeed = {
          ...baseFields,
          type: "job",
          position: position as JobNeed["position"],
        };
        return need;
      }

      default: {
        const _exhaustive: never = needJson;
        throw new Error(`Unknown need type: ${_exhaustive}`);
      }
    }
  });

  return {
    needs,
  };
}
