import { z } from "zod";
import type { Service, ServiceModule } from "~/modules/services/types";
import type { MediaMap } from "./parseMediaModule";
import { getMediaByIdOptional } from "./parseMediaModule";

/**
 * Zod schema for JSON representation of a service (with imageId instead of image object)
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
      message: "Service URL must be a valid URL (http:// or https://) or a relative path (starting with /)",
    },
  ),
  imageId: z.string().optional(),
  price: z.string().optional(),
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
 * Validates that all referenced media exist (if imageId is provided).
 *
 * @param jsonData - The parsed JSON data from the services.json file
 * @param options - Optional options including mediaMap for resolving image references
 * @returns Fully hydrated ServiceModule with Media objects resolved
 * @throws Error if any imageId cannot be resolved or if JSON structure is invalid
 */
export function parseServiceModule(
  jsonData: unknown,
  options?: ParseServiceModuleOptions,
): ServiceModule {
  // Validate JSON structure
  const validated = serviceModuleJsonSchema.parse(jsonData);

  const { mediaMap } = options ?? {};

  // Resolve imageId references and build hydrated service objects
  const services: Service[] = validated.services.map((serviceJson) => {
    const image = serviceJson.imageId && mediaMap
      ? getMediaByIdOptional(
          mediaMap,
          serviceJson.imageId,
          `service "${serviceJson.name}"`,
        )
      : undefined;

    const service: Service = {
      name: serviceJson.name,
      description: serviceJson.description,
      category: serviceJson.category,
      url: serviceJson.url,
      image,
      price: serviceJson.price,
    };

    return service;
  });

  return {
    services,
  };
}
