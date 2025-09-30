import { readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import type { KnowledgeFile } from "./types";
import type { Photo } from "~/modules/core/photos/types";

interface Result {
  knowledge: KnowledgeFile | null;
}

export class GetKnowledgeBySlugQuery {
  resultType?: Result;

  constructor(
    public readonly username: string,
    public readonly slug: string,
  ) {}
}

export class GetKnowledgeBySlugQueryHandler {
  private readonly usersDir = join(
    process.cwd(),
    "src/modules/data/organisations/users",
  );

  async handle(query: GetKnowledgeBySlugQuery): Promise<Result> {
    try {
      const filePath = join(
        this.usersDir,
        query.username,
        "notes",
        `${query.slug}.mdx`,
      );
      const fileContent = await readFile(filePath, "utf-8");

      // Parse frontmatter and content
      const { data: frontmatter, content } = matter(fileContent);

      const knowledge: KnowledgeFile = {
        id: (frontmatter.id as string) || `${query.username}-${query.slug}`,
        title: (frontmatter.title as string) || query.slug,
        description: (frontmatter.description as string) || "",
        type: frontmatter.type as "note" | "book" | "collection" | "shelf",
        content,
        slug: query.slug,
        isOrigin: (frontmatter.isOrigin as boolean) || true,
        isPublic: (frontmatter.isPublic as boolean) || true,
        isDraft: (frontmatter.isDraft as boolean) || false,
        chapterNumber: frontmatter.chapterNumber as number | undefined,
        verifiedDate: frontmatter.verifiedDate as string | undefined,
        query: frontmatter.query as string | undefined,
        queryType: frontmatter.queryType as "query" | "isbn",
        createdAt:
          (frontmatter.createdAt as string) || new Date().toISOString(),
        updatedAt:
          (frontmatter.updatedAt as string) || new Date().toISOString(),
        userId: query.username,
        coverPhoto: frontmatter.coverPhoto as Photo | undefined,
        inlinePhotos: frontmatter.inlinePhotos as Photo[],
      };

      return { knowledge };
    } catch (error) {
      console.error(
        `Error reading knowledge item ${query.username}/${query.slug}:`,
        error,
      );
      return { knowledge: null };
    }
  }
}
