import { z } from "zod";
import type {
  OrgAcademicCycle,
  ProgramCycle,
  ProgramCycleStatus,
  GlobalAcademicCycle,
} from "~/modules/academics/types";
import type {
  WorkforceModule,
  WorkforceMember,
} from "~/modules/workforce/types";
import type {
  PricingPackage,
  BillingCycle,
  PricingItemPurpose,
  PaymentSplit,
  DueAt,
} from "~/modules/core/economics/types";

/**
 * Error class for workforce member not found
 */
export class WorkforceMemberNotFoundError extends Error {
  constructor(
    public readonly memberSlug: string,
    public readonly context?: string,
  ) {
    const contextStr = context ? ` Referenced in ${context}.` : "";
    super(`Workforce member with slug "${memberSlug}" not found.${contextStr}`);
    this.name = "WorkforceMemberNotFoundError";
  }
}

/**
 * Error class for academic cycle not found
 */
export class AcademicCycleNotFoundError extends Error {
  constructor(
    public readonly cycleId: string,
    public readonly context?: string,
  ) {
    const contextStr = context ? ` Referenced in ${context}.` : "";
    super(`Academic cycle with id "${cycleId}" not found.${contextStr}`);
    this.name = "AcademicCycleNotFoundError";
  }
}

// Zod schemas for PricingPackage
const amountByCurrencySchema = z.record(z.string(), z.number());

const discountJsonSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  message: z.string().optional(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number(),
  currency: z.enum(["GYD", "USD", "JMD"]).optional(),
  validFrom: z.string().optional(),
  validUntil: z.string(),
  appliesTo: z.array(z.string()),
  isActive: z.boolean().optional(),
});

const pricingItemJsonSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  billingCycle: z.enum([
    "one-time",
    "annual",
    "term",
    "program",
  ]) as z.ZodType<BillingCycle>,
  amount: amountByCurrencySchema,
  purpose: z
    .enum(["registration", "tuition", "materials"])
    .optional() as z.ZodType<PricingItemPurpose | undefined>,
  optional: z.boolean().optional(),
  notes: z.string().optional(),
  isQuantityBased: z.boolean().optional(),
});

const dueAtJsonSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("now") }),
  z.object({ type: z.literal("date"), date: z.string() }),
  z.object({
    type: z.literal("after_start"),
    count: z.number(),
    unit: z.enum(["day", "week", "month", "year"]),
  }),
]) as z.ZodType<DueAt>;

const paymentSplitJsonSchema = z.object({
  id: z.string(),
  pricingItemId: z.string(),
  percentage: z.number(),
  dueAt: dueAtJsonSchema,
  note: z.string().optional(),
}) as z.ZodType<PaymentSplit>;

const pricingPackageJsonSchema = z.object({
  pricingItems: z.array(pricingItemJsonSchema),
  discounts: z.array(discountJsonSchema).optional(),
  paymentSplits: z.array(paymentSplitJsonSchema).optional(),
  notes: z.string().optional(),
});

// Zod schema for GlobalAcademicCycle (reference data)
const globalAcademicCycleJsonSchema = z.object({
  id: z.string(),
  label: z.string(),
  country: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(["term", "semester", "year", "custom"]),
  standardCycleKey: z.string(),
  academicYear: z.string(),
});

// Zod schema for OrgAcademicCycle
const orgAcademicCycleJsonSchema = z.object({
  id: z.string(),
  globalCycleId: z.string().optional(), // Reference to global cycle
  customLabel: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Zod schema for ProgramCycle
const programCycleJsonSchema = z.object({
  id: z.string(),
  academicCycleId: z.string(), // Reference to OrgAcademicCycle
  registrationPeriod: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
  teacherSlugs: z.array(z.string()).optional(), // References to workforce members
  capacity: z.number().optional(),
  enrolled: z.number().optional(),
  pricingPackage: pricingPackageJsonSchema,
  notes: z.string().optional(),
  status: z.enum(["open", "closed", "hidden"]).optional() as z.ZodType<
    ProgramCycleStatus | undefined
  >,
});

// Zod schema for cycles.json file structure
const cyclesModuleJsonSchema = z.object({
  globalCycles: z.array(globalAcademicCycleJsonSchema).optional(),
  academicCycles: z.array(orgAcademicCycleJsonSchema),
  programCycles: z.array(programCycleJsonSchema),
});

/**
 * Parsed cycles module containing maps for O(1) lookups
 */
export interface ParsedCyclesModule {
  globalCycles: Map<string, GlobalAcademicCycle>;
  academicCycles: Map<string, OrgAcademicCycle>;
  programCycles: Map<string, ProgramCycle>;
  programCyclesList: ProgramCycle[];
}

/**
 * Options for parsing cycles module
 */
export interface ParseCyclesModuleOptions {
  /** Workforce module for resolving teacher references */
  workforceModule?: WorkforceModule;
  /** Global cycles map if not included in JSON */
  globalCyclesMap?: Map<string, GlobalAcademicCycle>;
}

/**
 * Parses a cycles.json file and resolves references to workforce members and academic cycles.
 *
 * @param jsonData - The parsed JSON data from the cycles.json file
 * @param options - Options including workforce module for teacher resolution
 * @returns ParsedCyclesModule with maps for efficient lookups
 * @throws WorkforceMemberNotFoundError if a teacher reference cannot be resolved
 * @throws AcademicCycleNotFoundError if an academic cycle reference cannot be resolved
 */
export function parseCyclesModule(
  jsonData: unknown,
  options?: ParseCyclesModuleOptions,
): ParsedCyclesModule {
  const { workforceModule, globalCyclesMap } = options ?? {};

  // Validate JSON structure
  const validated = cyclesModuleJsonSchema.parse(jsonData);

  // Create workforce member lookup map
  const membersBySlug = new Map<string, WorkforceMember>();
  if (workforceModule) {
    for (const member of workforceModule.members) {
      membersBySlug.set(member.slug, member);
    }
  }

  // Parse global cycles
  const globalCycles = new Map<string, GlobalAcademicCycle>();
  if (globalCyclesMap) {
    for (const [id, cycle] of globalCyclesMap) {
      globalCycles.set(id, cycle);
    }
  }
  for (const cycleJson of validated.globalCycles ?? []) {
    const cycle: GlobalAcademicCycle = {
      ...cycleJson,
      id: cycleJson.id as GlobalAcademicCycle["id"],
      country: cycleJson.country as GlobalAcademicCycle["country"],
      standardCycleKey:
        cycleJson.standardCycleKey as GlobalAcademicCycle["standardCycleKey"],
    };
    globalCycles.set(cycleJson.id, cycle);
  }

  // Parse academic cycles
  const academicCycles = new Map<string, OrgAcademicCycle>();
  for (const cycleJson of validated.academicCycles) {
    const globalCycle = cycleJson.globalCycleId
      ? globalCycles.get(cycleJson.globalCycleId)
      : undefined;

    const cycle: OrgAcademicCycle = {
      id: cycleJson.id,
      globalCycle,
      customLabel: cycleJson.customLabel,
      startDate: cycleJson.startDate,
      endDate: cycleJson.endDate,
    };
    academicCycles.set(cycleJson.id, cycle);
  }

  // Parse program cycles
  const programCycles = new Map<string, ProgramCycle>();
  const programCyclesList: ProgramCycle[] = [];

  for (const cycleJson of validated.programCycles) {
    // Resolve academic cycle reference
    const academicCycle = academicCycles.get(cycleJson.academicCycleId);
    if (!academicCycle) {
      throw new AcademicCycleNotFoundError(
        cycleJson.academicCycleId,
        `program cycle "${cycleJson.id}"`,
      );
    }

    // Resolve teacher references
    const teachers: WorkforceMember[] = [];
    if (cycleJson.teacherSlugs && workforceModule) {
      for (const slug of cycleJson.teacherSlugs) {
        const member = membersBySlug.get(slug);
        if (!member) {
          throw new WorkforceMemberNotFoundError(
            slug,
            `program cycle "${cycleJson.id}"`,
          );
        }
        teachers.push(member);
      }
    }

    const pricingPackage: PricingPackage = {
      pricingItems: cycleJson.pricingPackage.pricingItems,
      discounts: cycleJson.pricingPackage.discounts,
      paymentSplits: cycleJson.pricingPackage.paymentSplits,
      notes: cycleJson.pricingPackage.notes,
    };

    const programCycle: ProgramCycle = {
      id: cycleJson.id,
      academicCycle,
      registrationPeriod: cycleJson.registrationPeriod,
      teachers: teachers.length > 0 ? teachers : undefined,
      capacity: cycleJson.capacity,
      enrolled: cycleJson.enrolled,
      pricingPackage,
      notes: cycleJson.notes,
      status: cycleJson.status,
    };

    programCycles.set(cycleJson.id, programCycle);
    programCyclesList.push(programCycle);
  }

  return {
    globalCycles,
    academicCycles,
    programCycles,
    programCyclesList,
  };
}

/**
 * Helper function to get a program cycle by ID with context for error messages.
 *
 * @param cyclesModule - The parsed cycles module
 * @param cycleId - The ID of the program cycle to retrieve
 * @param context - Optional context for error messages
 * @returns The ProgramCycle object
 * @throws Error if the cycle ID is not found
 */
export function getProgramCycleById(
  cyclesModule: ParsedCyclesModule,
  cycleId: string,
  context?: string,
): ProgramCycle {
  const cycle = cyclesModule.programCycles.get(cycleId);
  if (!cycle) {
    const contextStr = context ? ` Referenced in ${context}.` : "";
    throw new Error(
      `Program cycle with id "${cycleId}" not found.${contextStr}`,
    );
  }
  return cycle;
}

/**
 * Helper function to get multiple program cycles by IDs.
 *
 * @param cyclesModule - The parsed cycles module
 * @param cycleIds - Array of cycle IDs to retrieve
 * @param context - Optional context for error messages
 * @returns Array of ProgramCycle objects
 */
export function getProgramCyclesByIds(
  cyclesModule: ParsedCyclesModule,
  cycleIds: string[],
  context?: string,
): ProgramCycle[] {
  return cycleIds.map((id) => getProgramCycleById(cyclesModule, id, context));
}
