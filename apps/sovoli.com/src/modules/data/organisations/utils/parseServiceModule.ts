import { z } from "zod";
import type { Service, ServiceModule } from "~/modules/services/types";
import { slugify } from "~/utils/slugify";
import type { MediaMap } from "./parseMediaModule";
import { getMediaByIds } from "./parseMediaModule";

/**
 * Zod schema for JSON representation of a service (with media array instead of image/gallery objects)
 */
const serviceJsonSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string().optional(),
  url: z.string().refine(
    (val) => {
      // Allow full URLs (http:// or https://)
      if (val.startsWith("http://") || val.startsWith("https://")) {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }
      // Allow relative paths (starting with /)
      if (val.startsWith("/")) {
        return true;
      }
      return false;
    },
    {
      message:
        "Service URL must be a valid URL (http:// or https://) or a relative path (starting with /)",
    },
  ),
  media: z.array(z.string()).optional(),
  price: z.string().optional(),
  slug: z.string().optional(),
  whatWeDo: z.string().optional(),
  commonServices: z.array(z.string()).optional(),
  whoThisIsFor: z.array(z.string()).optional(),
  actionText: z.string().optional(),
});

/**
 * Zod schema for services.json file structure
 */
const serviceModuleJsonSchema = z.object({
  services: z.array(serviceJsonSchema),
});

/**
 * Options for parsing service module
 */
export interface ParseServiceModuleOptions {
  /** Media map for resolving image references */
  mediaMap?: MediaMap;
}

/**
 * Parses a services.json file and resolves foreign key references to Media objects.
 * Validates that all referenced media exist (if media is provided).
 *
 * @param jsonData - The parsed JSON data from the services.json file
 * @param options - Optional options including mediaMap for resolving media references
 * @returns Fully hydrated ServiceModule with Media objects resolved
 * @throws Error if any media ID cannot be resolved or if JSON structure is invalid
 */
export function parseServiceModule(
  jsonData: unknown,
  options?: ParseServiceModuleOptions,
): ServiceModule {
  // Validate JSON structure
  const validated = serviceModuleJsonSchema.parse(jsonData);

  const { mediaMap } = options ?? {};

  // Resolve media references and build hydrated service objects
  const services: Service[] = validated.services.map((serviceJson) => {
    const media =
      serviceJson.media && mediaMap
        ? getMediaByIds(
            mediaMap,
            serviceJson.media,
            `service "${serviceJson.name}"`,
          )
        : undefined;

    // Generate slug from name if not provided
    const slug = serviceJson.slug ?? slugify(serviceJson.name);

    const service: Service = {
      name: serviceJson.name,
      description: serviceJson.description,
      category: serviceJson.category,
      url: serviceJson.url,
      media,
      price: serviceJson.price,
      slug,
      whatWeDo: serviceJson.whatWeDo,
      commonServices: serviceJson.commonServices,
      whoThisIsFor: serviceJson.whoThisIsFor,
      actionText: serviceJson.actionText,
    };

    return service;
  });

  return {
    services,
  };
}
