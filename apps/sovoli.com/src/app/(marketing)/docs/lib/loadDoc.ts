import { existsSync } from "node:fs";
import type { ComponentType } from "react";
import { getDocPaths } from "./getDocPath";
import type { DocSection, DocMetadata } from "./types";

interface MDXModule {
  default: ComponentType;
  metadata?: DocMetadata;
}

export interface LoadedDoc {
  content: ComponentType;
  metadata: DocMetadata;
}

/**
 * Checks if a doc file exists for the given section and slug.
 * Returns the path if found, null otherwise.
 */
export function getDocFilePath(
  section: DocSection,
  slug: string[],
): string | null {
  const paths = getDocPaths(section, slug);

  // Try each path until we find one that exists
  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

/**
 * Loads an MDX file and returns both the component and metadata.
 * Tries multiple path patterns to find the file.
 */
export async function loadMDXDoc(
  section: DocSection,
  slug: string[],
): Promise<LoadedDoc | null> {
  // Build the import path - Next.js needs a pattern it can analyze
  // Use path alias ~/ which maps to src/
  const slugPath = slug.length === 0 ? "index" : slug.join("/");

  // Try direct file first, then directory with index
  try {
    // Try as direct file: ~/app/(marketing)/docs/_content/guides/whatsapp/new-business.mdx
    const directPath = `~/app/(marketing)/docs/_content/${section}/${slugPath}.mdx`;
    const mdxModule = (await import(directPath)) as MDXModule;
    if (mdxModule.metadata) {
      const result: LoadedDoc = {
        content: mdxModule.default,
        metadata: mdxModule.metadata,
      };
      return result;
    }
  } catch {
    // If direct file doesn't exist, try directory with index
    try {
      const indexPath = `~/app/(marketing)/docs/_content/${section}/${slugPath}/index.mdx`;
      const mdxModule = (await import(indexPath)) as MDXModule;
      if (mdxModule.metadata) {
        const result: LoadedDoc = {
          content: mdxModule.default,
          metadata: mdxModule.metadata,
        };
        return result;
      }
    } catch {
      // File doesn't exist - return null
    }
  }

  return null;
}
