import { z } from "zod";
import type { WorkforceModule } from "~/modules/workforce/types";
import type { AmountByCurrency } from "~/modules/core/economics/types";
import type { Contact } from "~/modules/core/types";
import type { MediaMap } from "./parseMediaModule";
import { getMediaByIdOptional, getMediaByIds } from "./parseMediaModule";

/**
 * Zod schema for Contact
 */
const contactJsonSchema = z.object({
  type: z.enum(["email", "phone", "whatsapp", "other"]),
  label: z.string().optional(),
  value: z.string(),
  isPublic: z.boolean(),
  primary: z.boolean().optional(),
});

/**
 * Zod schema for AmountByCurrency
 */
const amountByCurrencySchema = z
  .record(z.enum(["GYD", "USD", "JMD"]), z.number())
  .optional();

/**
 * Zod schema for Department
 */
const departmentJsonSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string(),
  url: z.string(),
});

/**
 * Zod schema for Team
 */
const teamJsonSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string(),
  url: z.string(),
});

/**
 * Zod schema for Position
 */
const positionJsonSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string(),
  url: z.string(),
  qualifications: z.array(z.string()).optional(),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "temporary", "volunteer"])
    .optional(),
  compensationRange: z
    .object({
      min: amountByCurrencySchema,
      max: amountByCurrencySchema,
      period: z.enum(["hourly", "monthly", "annual"]).optional(),
    })
    .optional(),
});

/**
 * Zod schema for OrgRoleAssignment
 */
const orgRoleAssignmentJsonSchema = z.object({
  positionSlug: z.string(), // Foreign key reference to position slug
  departmentSlug: z.string().optional(), // Foreign key reference to department slug
  teamSlug: z.string().optional(), // Foreign key reference to team slug
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isPrimary: z.boolean().optional(),
  titleOverride: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Zod schema for SubjectAssignment
 */
const subjectAssignmentJsonSchema = z.object({
  subject: z.string(),
  grades: z.array(z.string()),
});

/**
 * Zod schema for Education
 */
const educationJsonSchema = z.object({
  level: z.string(),
  field: z.string(),
  institution: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  honors: z.string().optional(),
  notes: z.string().optional(),
  url: z.string().optional(),
});

/**
 * Zod schema for Credential
 */
const credentialJsonSchema = z.object({
  type: z.enum(["certification", "license", "membership", "award", "other"]),
  name: z.string(),
  issuingOrganization: z.string().optional(),
  description: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  verificationUrl: z.string().optional(),
  notes: z.string().optional(),
  mediaIds: z.array(z.string()).optional(), // References media by IDs (for JSON parsing)
});

/**
 * Zod schema for WorkforceMember
 */
const workforceMemberJsonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  photoId: z.string().optional(), // References media by ID
  bio: z.string().optional(),
  contacts: z.array(contactJsonSchema).optional(),
  roleAssignments: z.array(orgRoleAssignmentJsonSchema),
  isPublic: z.boolean().optional(),
  quote: z.string().optional(),
  subjectAssignments: z.array(subjectAssignmentJsonSchema).optional(),
  education: z.array(educationJsonSchema).optional(),
  credentials: z.array(credentialJsonSchema).optional(),
});

/**
 * Zod schema for workforce.json file structure
 */
const workforceModuleJsonSchema = z.object({
  departments: z.array(departmentJsonSchema).optional(),
  teams: z.array(teamJsonSchema).optional(),
  positions: z.array(positionJsonSchema).optional(),
  members: z.array(workforceMemberJsonSchema).optional(),
});

/**
 * Options for parsing workforce module
 */
export interface ParseWorkforceModuleOptions {
  /** Optional media map for resolving photo references */
  mediaMap?: MediaMap;
}

/**
 * Parses a workforce.json file and resolves foreign key references.
 * Validates that all referenced positions, departments, and teams exist.
 *
 * @param jsonData - The parsed JSON data from the workforce.json file
 * @param options - Optional parsing options including mediaMap for photo resolution
 * @returns Fully hydrated WorkforceModule with all references resolved
 * @throws Error if any reference cannot be resolved or if JSON structure is invalid
 */
export function parseWorkforceModule(
  jsonData: unknown,
  options?: ParseWorkforceModuleOptions,
): WorkforceModule {
  const { mediaMap } = options ?? {};
  // Validate JSON structure
  const validated = workforceModuleJsonSchema.parse(jsonData);

  const departments = validated.departments ?? [];
  const teams = validated.teams ?? [];
  const positions = validated.positions ?? [];
  const members = validated.members ?? [];

  // Create maps for efficient lookup
  const departmentsBySlug = new Map(
    departments.map((dept) => [dept.slug, dept]),
  );
  const teamsBySlug = new Map(teams.map((team) => [team.slug, team]));
  const positionsBySlug = new Map(positions.map((pos) => [pos.slug, pos]));

  // Resolve role assignments for members
  const resolvedMembers = members.map((memberJson) => {
    const roleAssignments = memberJson.roleAssignments.map((roleJson) => {
      const position = positionsBySlug.get(roleJson.positionSlug);
      if (!position) {
        throw new Error(
          `Position with slug "${roleJson.positionSlug}" not found. Referenced in member "${memberJson.slug}" (${memberJson.name}).`,
        );
      }

      const department = roleJson.departmentSlug
        ? departmentsBySlug.get(roleJson.departmentSlug)
        : undefined;
      if (roleJson.departmentSlug && !department) {
        throw new Error(
          `Department with slug "${roleJson.departmentSlug}" not found. Referenced in member "${memberJson.slug}" (${memberJson.name}).`,
        );
      }

      const team = roleJson.teamSlug
        ? teamsBySlug.get(roleJson.teamSlug)
        : undefined;
      if (roleJson.teamSlug && !team) {
        throw new Error(
          `Team with slug "${roleJson.teamSlug}" not found. Referenced in member "${memberJson.slug}" (${memberJson.name}).`,
        );
      }

      return {
        position,
        department,
        team,
        startDate: roleJson.startDate,
        endDate: roleJson.endDate,
        isPrimary: roleJson.isPrimary,
        titleOverride: roleJson.titleOverride,
        notes: roleJson.notes,
      };
    });

    // Resolve photo from media map if photoId is provided
    const photo = mediaMap
      ? getMediaByIdOptional(
          mediaMap,
          memberJson.photoId,
          `workforce member "${memberJson.slug}"`,
        )
      : undefined;

    // Resolve credentials with media
    const credentials = memberJson.credentials
      ? memberJson.credentials.map((credJson) => {
          const media = mediaMap && credJson.mediaIds
            ? getMediaByIds(
                mediaMap,
                credJson.mediaIds,
                `credential "${credJson.name}" for workforce member "${memberJson.slug}"`,
              )
            : undefined;

          return {
            type: credJson.type,
            name: credJson.name,
            issuingOrganization: credJson.issuingOrganization,
            description: credJson.description,
            issueDate: credJson.issueDate,
            expiryDate: credJson.expiryDate,
            credentialId: credJson.credentialId,
            verificationUrl: credJson.verificationUrl,
            notes: credJson.notes,
            media,
          };
        })
      : undefined;

    return {
      id: memberJson.id,
      slug: memberJson.slug,
      name: memberJson.name,
      photo,
      bio: memberJson.bio,
      contacts: memberJson.contacts as Contact[] | undefined,
      roleAssignments,
      isPublic: memberJson.isPublic,
      quote: memberJson.quote,
      subjectAssignments: memberJson.subjectAssignments,
      education: memberJson.education,
      credentials,
    };
  });

  return {
    departments: departments as WorkforceModule["departments"],
    teams: teams as WorkforceModule["teams"],
    positions: positions as WorkforceModule["positions"],
    members: resolvedMembers as WorkforceModule["members"],
  };
}
