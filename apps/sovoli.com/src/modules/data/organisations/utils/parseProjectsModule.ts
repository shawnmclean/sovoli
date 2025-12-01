import { z } from "zod";
import type { Media } from "~/modules/core/media/types";
import type { NeedsModule } from "~/modules/needs/types";
import type {
  ProjectsModule,
  Project,
  ProjectGroup,
  ProjectPhase,
} from "~/modules/projects/types";

/**
 * Zod schema for Media (from JSON) - supports images, videos, PDFs, documents, and other file types
 */
const mediaJsonSchema = z.object({
  type: z
    .enum([
      "image",
      "video",
      "pdf",
      "document",
      "spreadsheet",
      "presentation",
      "audio",
    ])
    .default("image"),
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
  // Video-specific fields
  duration: z.number().optional(),
  videoCodec: z.string().optional(),
  audioCodec: z.string().optional(),
  fps: z.number().optional(),
  bitrate: z.number().optional(),
  posterUrl: z.string().optional(),
  // Document-specific fields
  pages: z.number().optional(),
  // Audio-specific fields
  audioDuration: z.number().optional(),
  audioBitrate: z.number().optional(),
});

/**
 * Zod schema for project phases (with needSlugs instead of inline needs)
 */
const projectPhaseJsonSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["planned", "active", "completed", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  needSlugs: z.array(z.string()).optional(), // Foreign key references to needs
  media: z.array(mediaJsonSchema).optional(),
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
  phases: z.array(projectPhaseJsonSchema).optional(), // Project phases with inline needs
  media: z.array(mediaJsonSchema).optional(),
  // Legacy support: also accept 'photos' in JSON for backward compatibility
  photos: z.array(mediaJsonSchema).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  groupOrder: z.number().optional(), // Order within the parent group
});

/**
 * Zod schema for JSON representation of a project group
 */
const projectGroupJsonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  projects: z.array(projectJsonSchema), // Nested projects
});

/**
 * Zod schema for the projects JSON file structure
 * Supports both groups (with nested projects) and root-level projects
 */
const projectsModuleJsonSchema = z.object({
  groups: z.array(projectGroupJsonSchema).optional(),
  projects: z.array(projectJsonSchema).optional(),
});

/**
 * Parses a projects JSON file and resolves foreign key references to Need objects.
 * Supports projects nested in groups and root-level projects.
 * Validates that all referenced needs exist.
 *
 * @param jsonData - The parsed JSON data from the projects.json file
 * @param needsModule - The NeedsModule containing all available needs
 * @returns Fully hydrated ProjectsModule with Need[] resolved and groups hydrated
 * @throws Error if any needSlug cannot be resolved or if JSON structure is invalid
 */
export function parseProjectsModule(
  jsonData: unknown,
  needsModule: NeedsModule,
): ProjectsModule {
  // Validate JSON structure
  const validated = projectsModuleJsonSchema.parse(jsonData);

  // Ensure at least one of groups or projects exists
  if (
    (!validated.groups || validated.groups.length === 0) &&
    (!validated.projects || validated.projects.length === 0)
  ) {
    throw new Error(
      "Projects JSON must contain at least one of 'groups' or 'projects' arrays.",
    );
  }

  // Create a map of needs by slug for efficient lookup
  const needsBySlug = new Map(
    needsModule.needs.map((need) => [need.slug, need]),
  );

  // Create a map of groups by id for efficient lookup
  const groupsById = new Map<string, ProjectGroup>();
  if (validated.groups) {
    for (const groupJson of validated.groups) {
      groupsById.set(groupJson.id, {
        id: groupJson.id,
        slug: groupJson.slug,
        name: groupJson.name,
        description: groupJson.description,
      });
    }
  }

  // Helper function to hydrate a project with needs and optionally a group
  const hydrateProject = (
    projectJson: z.infer<typeof projectJsonSchema>,
    group?: ProjectGroup,
    order?: number,
  ): Project => {
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

    // Parse phases if present
    let phases: ProjectPhase[] | undefined;
    if (projectJson.phases && projectJson.phases.length > 0) {
      phases = projectJson.phases.map((phaseJson) => {
        const phase: ProjectPhase = {
          title: phaseJson.title,
          description: phaseJson.description,
          status: phaseJson.status,
          priority: phaseJson.priority,
          startDate: phaseJson.startDate,
          endDate: phaseJson.endDate,
          media: phaseJson.media as Media[] | undefined,
        };

        // Resolve phase needSlugs to Need objects
        if (phaseJson.needSlugs && phaseJson.needSlugs.length > 0) {
          phase.needs = phaseJson.needSlugs.map((slug) => {
            const need = needsBySlug.get(slug);
            if (!need) {
              throw new Error(
                `Need with slug "${slug}" not found. Referenced in phase "${phaseJson.title}" of project "${projectJson.id}" (${projectJson.title}).`,
              );
            }
            return need;
          });
        }

        return phase;
      });
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
      phases,
      media: (projectJson.media ?? projectJson.photos) as Media[] | undefined,
      tags: projectJson.tags,
      notes: projectJson.notes,
      createdAt: projectJson.createdAt,
      updatedAt: projectJson.updatedAt,
    };

    // Add group information if provided
    if (group) {
      project.group = {
        ...group,
        order: order ?? projectJson.groupOrder,
      };
    }

    return project;
  };

  // Extract projects from groups (nested) and hydrate with group info
  const projectsFromGroups: Project[] = [];
  if (validated.groups) {
    for (const groupJson of validated.groups) {
      const group = groupsById.get(groupJson.id);
      if (!group) {
        throw new Error(
          `Group with id "${groupJson.id}" not found in groups map.`,
        );
      }

      groupJson.projects.forEach((projectJson, index) => {
        const order = projectJson.groupOrder ?? index + 1;
        projectsFromGroups.push(hydrateProject(projectJson, group, order));
      });
    }
  }

  // Extract root-level projects (ungrouped)
  const rootProjects: Project[] = [];
  if (validated.projects) {
    for (const projectJson of validated.projects) {
      rootProjects.push(hydrateProject(projectJson));
    }
  }

  // Combine all projects
  const allProjects = [...projectsFromGroups, ...rootProjects];

  return {
    projects: allProjects,
  };
}
