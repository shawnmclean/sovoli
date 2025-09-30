import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";
import matter from "gray-matter";
import type { KnowledgeFile, UserKnowledge } from "./types";
import type { Photo } from "~/modules/core/photos/types";

interface Result {
  userKnowledge: UserKnowledge | null;
}

export class GetUserKnowledgeByUsernameQuery {
  resultType?: Result;

  constructor(public readonly username: string) {}
}

export class GetUserKnowledgeByUsernameQueryHandler {
  private readonly usersDir = join(
    process.cwd(),
    "src/modules/data/organisations/users",
  );

  async handle(query: GetUserKnowledgeByUsernameQuery): Promise<Result> {
    try {
      const userDir = join(this.usersDir, query.username, "notes");

      // Check if user directory exists
      const userDirExists = await this.directoryExists(userDir);
      if (!userDirExists) {
        return { userKnowledge: null };
      }

      // Read all .mdx files for this user
      const knowledgeItems = await this.readUserKnowledgeItems(query.username);

      return {
        userKnowledge: {
          username: query.username,
          knowledgeItems,
        },
      };
    } catch (error) {
      console.error(
        `Error reading knowledge for user ${query.username}:`,
        error,
      );
      return { userKnowledge: null };
    }
  }

  private async readUserKnowledgeItems(
    username: string,
  ): Promise<KnowledgeFile[]> {
    const userDir = join(this.usersDir, username, "notes");
    const entries = await readdir(userDir, { withFileTypes: true });

    const knowledgeItems: KnowledgeFile[] = [];

    for (const entry of entries) {
      if (entry.isFile() && extname(entry.name) === ".mdx") {
        const slug = entry.name.replace(".mdx", "");
        const knowledgeItem = await this.readKnowledgeItem(username, slug);
        if (knowledgeItem) {
          knowledgeItems.push(knowledgeItem);
        }
      }
    }

    return knowledgeItems;
  }

  private async readKnowledgeItem(
    username: string,
    slug: string,
  ): Promise<KnowledgeFile | null> {
    try {
      const filePath = join(this.usersDir, username, "notes", `${slug}.mdx`);
      const fileContent = await readFile(filePath, "utf-8");

      // Parse frontmatter and content
      const { data: frontmatter, content } = matter(fileContent);

      return {
        id: (frontmatter.id as string) || `${username}-${slug}`,
        title: (frontmatter.title as string) || slug,
        description: (frontmatter.description as string) || "",
        type: frontmatter.type as "note" | "book" | "collection" | "shelf",
        content,
        slug,
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
        userId: username,
        coverPhoto: frontmatter.coverPhoto as Photo | undefined,
        inlinePhotos: frontmatter.inlinePhotos as Photo[],
      };
    } catch (error) {
      console.error(`Error reading knowledge item ${username}/${slug}:`, error);
      return null;
    }
  }

  private async directoryExists(path: string): Promise<boolean> {
    try {
      const { stat } = await import("fs/promises");
      const stats = await stat(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
}
