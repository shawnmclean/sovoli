import { z } from "zod";
import { env } from "~/env";
import type { WebsiteModule } from "~/modules/websites/types";

/**
 * Zod schema for website image
 */
const websiteImageJsonSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
});

/**
 * Zod schema for NavItem
 */
const navItemJsonSchema = z.object({
  key: z.enum([
    "home",
    "about",
    "academics",
    "offerings",
    "workforce",
    "contact",
  ]),
  label: z.string(),
});

/**
 * Zod schema for NavAction
 */
const navActionJsonSchema = z.object({
  key: z.enum(["apply", "contact", "schedule"]),
  label: z.string(),
});

/**
 * Zod schema for FooterLink
 */
const footerLinkJsonSchema = z.object({
  label: z.string(),
  url: z.string(),
  target: z.enum(["_blank", "_self", "_parent", "_top"]).optional(),
});

/**
 * Zod schema for FooterSection
 */
const footerSectionJsonSchema = z.object({
  key: z.enum(["social", "academics", "offerings", "contact", "other"]),
  title: z.string().optional(),
  description: z.string().optional(),
  links: z.array(footerLinkJsonSchema).optional(),
});

/**
 * Zod schema for PageConfig (simplified - full structure would need more investigation)
 */
const pageConfigJsonSchema = z.record(z.unknown());

/**
 * Zod schema for Website
 */
const websiteJsonSchema = z.object({
  siteName: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string().optional(), // Optional in JSON, will be generated if not provided
  domain: z.string().optional(), // Optional in JSON, will be generated if not provided
  images: z.array(websiteImageJsonSchema),
  header: z
    .object({
      layout: z.enum(["default", "minimal"]),
      variant: z.enum(["default", "transparent"]),
      nav: z.array(navItemJsonSchema),
      actions: z.array(navActionJsonSchema).optional(),
    })
    .optional(),
  footer: z
    .object({
      layout: z.enum(["default", "minimal"]),
      variant: z.enum(["default", "transparent"]),
      sections: z.array(footerSectionJsonSchema),
    })
    .optional(),
  pages: z.array(pageConfigJsonSchema),
});

/**
 * Zod schema for website.json file structure
 */
const websiteModuleJsonSchema = z.object({
  website: websiteJsonSchema,
});

/**
 * Generates domain based on username and environment
 */
function generateDomain(username: string): string {
  if (env.NODE_ENV === "development") {
    return `${username}.localhost:3000`;
  }
  return `${username}.sovoli.com`;
}

/**
 * Parses a website.json file and generates domain/url if not provided.
 *
 * @param jsonData - The parsed JSON data from the website.json file
 * @param username - The organization username for domain generation
 * @returns Fully hydrated WebsiteModule with domain/url generated if needed
 * @throws Error if JSON structure is invalid
 */
export function parseWebsiteModule(
  jsonData: unknown,
  username: string,
): WebsiteModule {
  const validated = websiteModuleJsonSchema.parse(jsonData);

  // Generate domain if not provided
  const domain = validated.website.domain ?? generateDomain(username);
  const url =
    validated.website.url ?? `https://${domain}`;

  const websiteModule: WebsiteModule = {
    website: {
      ...validated.website,
      domain,
      url,
    },
  };

  return websiteModule;
}
