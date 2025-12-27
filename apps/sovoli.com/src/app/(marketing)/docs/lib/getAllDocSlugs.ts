import { readdir, stat } from "fs/promises";
import { join, extname, relative } from "node:path";
import type { DocSection } from "./types";

const CONTENT_DIR = join(
  process.cwd(),
  "src",
  "app",
  "(marketing)",
  "docs",
  "_content",
);

/**
 * Recursively finds all MDX files in a directory and returns their slugs.
 * For example, guides/whatsapp/index.mdx -> ["whatsapp"]
 * guides/whatsapp/new-business.mdx -> ["whatsapp", "new-business"]
 */
async function findMdxFiles(
  dir: string,
  sectionDir: string,
): Promise<string[][]> {
  const slugs: string[][] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      const subSlugs = await findMdxFiles(fullPath, sectionDir);
      slugs.push(...subSlugs);
    } else if (entry.isFile() && extname(entry.name) === ".mdx") {
      if (entry.name === "index.mdx") {
        // Index file -> slug is the directory path (or empty for root index)
        const dirPath = relative(sectionDir, dir);
        if (!dirPath || dirPath === ".") {
          // Root index file -> empty slug array
          slugs.push([]);
        } else {
          // Directory index file -> slug is the directory path
          slugs.push(dirPath.split(/[/\\]/));
        }
      } else {
        // Regular file -> slug includes the filename
        const relativePath = relative(sectionDir, fullPath).replace(
          /\.mdx$/,
          "",
        );
        slugs.push(relativePath.split(/[/\\]/));
      }
    }
  }

  return slugs;
}

/**
 * Gets all doc slugs for a given section by scanning the filesystem.
 * Returns an array of slug arrays, where each slug array represents a route.
 */
export async function getAllDocSlugs(section: DocSection): Promise<string[][]> {
  const sectionDir = join(CONTENT_DIR, section);

  try {
    const stats = await stat(sectionDir);
    if (!stats.isDirectory()) {
      return [];
    }
  } catch {
    // Directory doesn't exist
    return [];
  }

  return findMdxFiles(sectionDir, sectionDir);
}

/**
 * Gets all static params for the docs catch-all route.
 * Returns an array of objects with slug arrays.
 */
export async function getAllDocParams(): Promise<{ slug: string[] }[]> {
  const sections: DocSection[] = ["guides", "reference"];
  const allParams: { slug: string[] }[] = [];

  for (const section of sections) {
    console.log("[getAllDocParams] Getting slugs for section:", section);
    const slugs = await getAllDocSlugs(section);
    console.log("[getAllDocParams] Found slugs for", section, ":", slugs);
    for (const slug of slugs) {
      allParams.push({ slug: [section, ...slug] });
    }
  }

  console.log(
    "[getAllDocParams] All params:",
    allParams.map((p) => p.slug.join("/")),
  );
  return allParams;
}
