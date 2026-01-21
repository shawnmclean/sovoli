import { z } from "zod";
import type {
  AcademicModule,
  Program,
  ProgramMedia,
  ProgramHighlight,
  ProgramHighlightIcon,
  ProgramWYLGroup,
  ProgramTestimonial,
  Course,
  Activity,
  AdmissionPolicy,
  RequirementList,
  RequirementListEntry,
  ProgramGroup,
  Capability,
  ProgramCertification,
} from "~/modules/academics/types";
import type { Item } from "~/modules/core/items/types";
import type { MediaMap } from "./parseMediaModule";
import {
  getMediaByIds,
  getMediaByIdOptional,
} from "./parseMediaModule";
import type { ParsedCyclesModule } from "./parseCyclesModule";
import { getProgramCyclesByIds } from "./parseCyclesModule";
import { hydrateProgramCategory } from "~/modules/data/academics/categories";

// Zod schemas for nested program types

const programHighlightIconSchema = z.enum([
  "graduation-cap",
  "users",
  "user",
  "book-open",
  "clock",
  "star",
  "badge-check",
  "scissors",
  "shopping-bag",
  "hammer",
  "tool",
  "baby",
  "palette",
  "school",
  "shield-check",
  "map-pin",
  "smile",
  "message-circle",
]) as z.ZodType<ProgramHighlightIcon>;

const programHighlightJsonSchema = z.object({
  icon: programHighlightIconSchema,
  label: z.string(),
  description: z.string(),
});

const programWYLItemJsonSchema = z.object({
  id: z.string(),
  title: z.string(),
  blurb: z.string(),
  tag: z.string().optional(),
});

const programWYLGroupJsonSchema = z.object({
  heading: z.string(),
  items: z.array(programWYLItemJsonSchema),
});

// Capability schemas
const competencyJsonSchema = z.object({
  statement: z.string(),
});

const capabilityJsonSchema = z.object({
  outcome: z.string(),
  description: z.string().optional(),
  competencies: z.array(competencyJsonSchema),
});

const programCertificationJsonSchema = z.object({
  description: z.string(),
});

const programTestimonialJsonSchema = z.object({
  author: z.string(),
  content: z.string(),
  date: z.string().optional(),
  rating: z.number(),
  relation: z.enum(["Parent", "Student", "Guardian"]),
  link: z.string().optional(),
  source: z.enum(["google", "facebook", "other"]).optional(),
});

const subjectJsonSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const courseUnitJsonSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  topics: z.array(z.string()),
  competencyIds: z.array(z.string()).optional(),
});

const courseJsonSchema = z.object({
  id: z.string(),
  subject: subjectJsonSchema,
  title: z.string(),
  description: z.string().optional(),
  units: z.array(courseUnitJsonSchema).optional(),
});

const activityJsonSchema = z.object({
  id: z.string(),
  title: z.string(),
});

const ageRangeJsonSchema = z.object({
  minAgeYears: z.number().optional(),
  minAgeMonths: z.number().optional(),
  maxAgeYears: z.number().optional(),
  maxAgeMonths: z.number().optional(),
});

const ageEligibilityJsonSchema = z.object({
  type: z.literal("age"),
  description: z.string().optional(),
  ageRange: ageRangeJsonSchema.optional(),
  name: z.string().optional(),
});

const admissionDocumentRuleJsonSchema = z.object({
  type: z.literal("document"),
  name: z.string(),
  description: z.string().optional(),
  requirement: z.enum(["required", "optional", "conditional"]),
  conditionNote: z.string().optional(),
});

const admissionPolicyJsonSchema = z.object({
  id: z.string(),
  eligibility: z.array(ageEligibilityJsonSchema),
  documents: z.array(admissionDocumentRuleJsonSchema),
  notes: z.string().optional(),
});

// Simplified requirement schema - items reference global items by ID
const requirementListEntryJsonSchema = z.object({
  itemId: z.string(), // Reference to global item
  quantity: z.number().optional(),
  unit: z.string().optional(),
  isOptional: z.boolean().optional(),
  source: z.enum(["bring", "buy-at-school", "either"]).optional(),
  notes: z.string().optional(),
});

const requirementListJsonSchema = z.object({
  name: z.string(),
  category: z.enum(["booklist", "materials", "uniform", "other"]),
  audience: z.enum(["parent", "student"]).optional(),
  notes: z.string().optional(),
  items: z.array(requirementListEntryJsonSchema),
});

const programGroupJsonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number().optional(),
});

// Media reference schema for programs
const programMediaJsonSchema = z.object({
  coverId: z.string().optional(),
  galleryIds: z.array(z.string()).optional(),
});

// Main program schema
const programJsonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string().optional(),
  quickFacts: z.array(z.string()).optional(),
  audience: z.enum(["student", "parent"]).optional(),
  categoryId: z.string().optional(),
  highlights: z.array(programHighlightJsonSchema).optional(),
  courses: z.array(courseJsonSchema).optional(),
  activities: z.array(activityJsonSchema).optional(),
  group: programGroupJsonSchema.optional(), // Old format: inline group
  groupId: z.string().optional(), // New format: reference to group ID
  tagline: z.string().optional(),
  outcome: z.string().optional(),
  description: z.string().optional(),
  media: programMediaJsonSchema.optional(),
  admission: admissionPolicyJsonSchema.optional(),
  requirements: z.array(requirementListJsonSchema).optional(),
  notes: z.string().optional(),
  isPopular: z.boolean().optional(),
  testimonials: z.array(programTestimonialJsonSchema).optional(),
  cycleIds: z.array(z.string()).optional(), // References to program cycles
  whatYouWillLearn: z.array(programWYLGroupJsonSchema).optional(), // deprecated
  capabilities: z.array(capabilityJsonSchema).optional(),
  certification: programCertificationJsonSchema.optional(),
});

// Academic module schema
const academicModuleJsonSchema = z.object({
  programs: z.array(programJsonSchema),
  studentCount: z.number().optional(),
});

/**
 * Options for parsing academic module
 */
export interface ParseAcademicModuleOptions {
  /** Media map for resolving photo references */
  mediaMap?: MediaMap;
  /** Parsed cycles module for resolving cycle references */
  cyclesModule?: ParsedCyclesModule;
  /** Function to resolve item IDs to Item objects (for requirements) */
  itemResolver?: (itemId: string) => Item | undefined;
  /** Map of group IDs to ProgramGroup objects (for group-based format) */
  programGroups?: Map<string, ProgramGroup & { order?: number }>;
}

/**
 * Parses an academic.json/programs.json file and resolves media and cycle references.
 *
 * @param jsonData - The parsed JSON data from the academic.json file
 * @param options - Options including mediaMap and cyclesModule for reference resolution
 * @returns Fully hydrated AcademicModule with all references resolved
 * @throws MediaNotFoundError if a media reference cannot be resolved
 * @throws Error if a cycle reference cannot be resolved
 */
export function parseAcademicModule(
  jsonData: unknown,
  options?: ParseAcademicModuleOptions,
): AcademicModule {
  const { mediaMap, cyclesModule, itemResolver, programGroups } = options ?? {};

  // Validate JSON structure
  const validated = academicModuleJsonSchema.parse(jsonData);

  const programs: Program[] = validated.programs.map((programJson) => {
    const category = programJson.categoryId
      ? hydrateProgramCategory(programJson.categoryId)
      : undefined;

    // Resolve media references
    let media: ProgramMedia | undefined;
    if (programJson.media && mediaMap) {
      const cover = getMediaByIdOptional(
        mediaMap,
        programJson.media.coverId,
        `program "${programJson.slug}"`,
      );
      const gallery = programJson.media.galleryIds
        ? getMediaByIds(
          mediaMap,
          programJson.media.galleryIds,
          `program "${programJson.slug}"`,
        )
        : undefined;

      if (cover || gallery) {
        media = { cover, gallery };
      }
    }

    // Resolve cycle references
    const cycles =
      programJson.cycleIds && cyclesModule
        ? getProgramCyclesByIds(
          cyclesModule,
          programJson.cycleIds,
          `program "${programJson.slug}"`,
        )
        : undefined;

    // Resolve requirement item references
    let requirements: RequirementList[] | undefined;
    if (programJson.requirements && itemResolver) {
      requirements = programJson.requirements.map(
        (reqList): RequirementList => {
          const items: RequirementListEntry[] = reqList.items
            .map((entry) => {
              const item = itemResolver(entry.itemId);
              if (!item) {
                console.warn(
                  `Item with id "${entry.itemId}" not found. Referenced in program "${programJson.slug}".`,
                );
                return null;
              }
              const reqEntry: RequirementListEntry = {
                item,
                quantity: entry.quantity,
                unit: entry.unit,
                isOptional: entry.isOptional,
                source: entry.source,
                notes: entry.notes,
              };
              return reqEntry;
            })
            .filter((entry): entry is RequirementListEntry => entry !== null);

          return {
            name: reqList.name,
            category: reqList.category,
            audience: reqList.audience,
            notes: reqList.notes,
            items,
          };
        },
      );
    }

    // Resolve group reference
    let group: (ProgramGroup & { order?: number }) | undefined;
    if (programJson.groupId && programGroups) {
      // New format: resolve groupId from programGroups map
      const resolvedGroup = programGroups.get(programJson.groupId);
      if (resolvedGroup) {
        group = resolvedGroup;
      } else {
        console.warn(
          `Group with id "${programJson.groupId}" not found. Referenced in program "${programJson.slug}".`,
        );
      }
    } else if (programJson.group) {
      // Old format: use inline group
      group = programJson.group as ProgramGroup & { order?: number };
    }

    // Build the program
    const program: Program = {
      id: programJson.id,
      slug: programJson.slug,
      name: programJson.name,
      quickFacts: programJson.quickFacts,
      audience: programJson.audience,
      category,
      highlights: programJson.highlights as ProgramHighlight[] | undefined,
      courses: programJson.courses as Course[] | undefined,
      activities: programJson.activities as Activity[] | undefined,
      group,
      tagline: programJson.tagline,
      outcome: programJson.outcome,
      description: programJson.description,
      media,
      admission: programJson.admission as AdmissionPolicy | undefined,
      requirements,
      notes: programJson.notes,
      isPopular: programJson.isPopular,
      testimonials: programJson.testimonials as
        | ProgramTestimonial[]
        | undefined,
      cycles,
      whatYouWillLearn: programJson.whatYouWillLearn as
        | ProgramWYLGroup[]
        | undefined,
      capabilities: programJson.capabilities as
        | Capability[]
        | undefined,
      certification: programJson.certification as
        | ProgramCertification
        | undefined,
    };

    return program;
  });

  return {
    programs,
    studentCount: validated.studentCount,
  };
}
