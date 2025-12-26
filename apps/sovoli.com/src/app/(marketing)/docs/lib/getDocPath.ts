import { join } from "node:path";
import type { DocSection } from "./types";

const CONTENT_DIR = join(process.cwd(), "src", "app", "(marketing)", "docs", "_content");

/**
 * Gets all possible paths to check for a doc.
 * Returns paths in order: direct file, then directory with index.
 */
export function getDocPaths(
  section: DocSection,
  slug: string[],
): string[] {
  const sectionDir = join(CONTENT_DIR, section);

  if (slug.length === 0) {
    return [join(sectionDir, "index.mdx")];
  }

  return [
    join(sectionDir, ...slug) + ".mdx", // Direct file
    join(sectionDir, ...slug, "index.mdx"), // Directory with index
  ];
}

