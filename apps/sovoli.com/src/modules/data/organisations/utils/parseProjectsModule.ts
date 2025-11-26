import { z } from "zod";
import type { Photo } from "~/modules/core/photos/types";
import type { NeedsModule } from "~/modules/needs/types";
import type { ProjectsModule, Project } from "~/modules/projects/types";

/**
 * Zod schema for Photo (from JSON)
 */
const photoJsonSchema = z.object({
  url: z.string(),
  publicId: z.string(),
  assetId: z.string().optional(),
  bucket: z.string().optional(),
  uploadedAt: z.string().optional(),
  bytes: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  version: z.number().optional(),
  caption: z.string().optional(),
  alt: z.string().optional(),
  category: z
    .enum([
      "environment",
      "classroom",
      "activities",
      "events",
      "awards",
      "default",
    ])
    .optional(),
});

/**
 * Zod schema for JSON representation of a project (with needSlugs instead of needs array)
 */
const projectJsonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z
    .enum([
      "maintenance",
      "construction",
      "education",
      "event",
      "relief",
      "administration",
      "other",
    ])
    .optional(),
  status: z.enum(["planned", "active", "completed", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  locationKey: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  internal: z.boolean().optional(),
  needSlugs: z.array(z.string()).optional(), // Foreign key references to needs
  photos: z.array(photoJsonSchema).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Zod schema for the projects JSON file structure
 */
const projectsModuleJsonSchema = z.object({
  projects: z.array(projectJsonSchema),
});

/**
 * Parses a projects JSON file and resolves foreign key references to Need objects.
 * Validates that all referenced needs exist.
 *
 * @param jsonData - The parsed JSON data from the projects.json file
 * @param needsModule - The NeedsModule containing all available needs
 * @returns Fully hydrated ProjectsModule with Need[] resolved
 * @throws Error if any needSlug cannot be resolved or if JSON structure is invalid
 */
export function parseProjectsModule(
  jsonData: unknown,
  needsModule: NeedsModule,
): ProjectsModule {
  // Validate JSON structure
  const validated = projectsModuleJsonSchema.parse(jsonData);

  // Create a map of needs by slug for efficient lookup
  const needsBySlug = new Map(
    needsModule.needs.map((need) => [need.slug, need]),
  );

  // Resolve needSlugs references and validate they exist
  const projects: Project[] = validated.projects.map((projectJson) => {
    let needs: typeof needsModule.needs | undefined;

    if (projectJson.needSlugs && projectJson.needSlugs.length > 0) {
      const resolvedNeeds = projectJson.needSlugs.map((slug) => {
        const need = needsBySlug.get(slug);
        if (!need) {
          throw new Error(
            `Need with slug "${slug}" not found. Referenced in project "${projectJson.id}" (${projectJson.title}).`,
          );
        }
        return need;
      });
      needs = resolvedNeeds;
    }

    // Build the hydrated project object
    const project: Project = {
      id: projectJson.id,
      title: projectJson.title,
      description: projectJson.description,
      category: projectJson.category,
      status: projectJson.status,
      priority: projectJson.priority,
      locationKey: projectJson.locationKey,
      startDate: projectJson.startDate,
      endDate: projectJson.endDate,
      internal: projectJson.internal,
      needs,
      photos: projectJson.photos as Photo[] | undefined,
      tags: projectJson.tags,
      notes: projectJson.notes,
      createdAt: projectJson.createdAt,
      updatedAt: projectJson.updatedAt,
    };

    return project;
  });

  return {
    projects,
  };
}
