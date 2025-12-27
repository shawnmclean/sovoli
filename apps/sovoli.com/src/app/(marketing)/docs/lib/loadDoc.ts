import type { ComponentType } from "react";
import type { DocSection, DocMetadata } from "./types";

interface MDXModule {
  default?: ComponentType;
  metadata?: DocMetadata;
}

export interface LoadedDoc {
  content: ComponentType;
  metadata: DocMetadata;
}

export async function loadMDXDoc(
  section: DocSection,
  slug: string[],
): Promise<LoadedDoc | null> {
  console.log("[loadDoc] Loading doc:", { section, slug });

  // Build the full path as a single string variable (like the test example)
  // This file is at: src/app/(marketing)/docs/lib/loadDoc.ts
  // Content is at: src/app/(marketing)/docs/_content/
  // So relative path is: ../_content/
  let path: string;
  if (slug.length === 0) {
    path = `../_content/${section}/index.mdx`;
  } else {
    const slugPath = slug.join("/");
    path = `../_content/${section}/${slugPath}.mdx`;
  }

  console.log("[loadDoc] Trying path:", path);

  // Try direct file first
  try {
    console.log("[loadDoc] Attempting to import:", path);
    const mdxModule = (await import(path)) as MDXModule;
    if (mdxModule.default) {
      console.log("[loadDoc] Successfully loaded doc from:", path);
      return {
        content: mdxModule.default,
        metadata: mdxModule.metadata ?? {
          title: "Documentation",
          description: "",
        },
      };
    }
  } catch (error) {
    console.log(
      "[loadDoc] Direct import failed:",
      error instanceof Error ? error.message : String(error),
    );
  }

  // Try directory with index as fallback
  if (slug.length > 0) {
    const slugPath = slug.join("/");
    const indexPath = `../_content/${section}/${slugPath}/index.mdx`;
    try {
      console.log("[loadDoc] Attempting to import index:", indexPath);
      const mdxModule = (await import(indexPath)) as MDXModule;
      if (mdxModule.default) {
        console.log("[loadDoc] Successfully loaded doc from:", indexPath);
        return {
          content: mdxModule.default,
          metadata: mdxModule.metadata ?? {
            title: "Documentation",
            description: "",
          },
        };
      }
    } catch (error) {
      console.log(
        "[loadDoc] Index import failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  console.log("[loadDoc] No doc found for:", { section, slug });
  return null;
}
