import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";
import matter from "gray-matter";
import type { KnowledgeFile, UserSlug } from "./types";
import type { Media } from "~/modules/core/media/types";

export class KnowledgeFileCache {
  private static instance?: KnowledgeFileCache;
  private knowledgeFiles: KnowledgeFile[] = [];
  private userSlugs: UserSlug[] = [];
  private isLoaded = false;
  private readonly usersDir = join(
    process.cwd(),
    "src/modules/data/organisations/users",
  );

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): KnowledgeFileCache {
    if (KnowledgeFileCache.instance === undefined) {
      KnowledgeFileCache.instance = new KnowledgeFileCache();
    }
    return KnowledgeFileCache.instance;
  }

  public async loadAllFiles(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    try {
      const knowledgeFiles: KnowledgeFile[] = [];
      const userSlugs: UserSlug[] = [];

      // Read all user directories
      const userDirs = await readdir(this.usersDir, { withFileTypes: true });

      for (const userDir of userDirs) {
        if (userDir.isDirectory()) {
          const username = userDir.name;
          const userNotesPath = join(this.usersDir, username, "notes");

          // Check if notes directory exists
          const notesDirExists = await this.directoryExists(userNotesPath);
          if (!notesDirExists) continue;

          // Read all .mdx files for this user
          const files = await readdir(userNotesPath, { withFileTypes: true });

          for (const file of files) {
            if (file.isFile() && extname(file.name) === ".mdx") {
              const filePath = join(userNotesPath, file.name);
              const knowledgeFile = await this.readKnowledgeFile(
                filePath,
                username,
              );

              if (knowledgeFile) {
                knowledgeFiles.push(knowledgeFile);
                userSlugs.push({
                  username,
                  slug: knowledgeFile.slug,
                });
              }
            }
          }
        }
      }

      // Sort by creation date (newest first)
      knowledgeFiles.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      this.knowledgeFiles = knowledgeFiles;
      this.userSlugs = userSlugs;
      this.isLoaded = true;

      console.log(`Loaded ${knowledgeFiles.length} knowledge files into cache`);
    } catch (error) {
      console.error("Error loading knowledge files:", error);
      this.knowledgeFiles = [];
      this.userSlugs = [];
    }
  }

  public getAllKnowledgeFiles(): KnowledgeFile[] {
    return [...this.knowledgeFiles];
  }

  public getUserSlugs(): UserSlug[] {
    return [...this.userSlugs];
  }

  public getKnowledgeFileBySlug(
    username: string,
    slug: string,
  ): KnowledgeFile | null {
    return (
      this.knowledgeFiles.find(
        (file) => file.userId === username && file.slug === slug,
      ) ?? null
    );
  }

  public getKnowledgeFilesByUsername(username: string): KnowledgeFile[] {
    return this.knowledgeFiles.filter((file) => file.userId === username);
  }

  public async refresh(): Promise<void> {
    this.isLoaded = false;
    this.knowledgeFiles = [];
    this.userSlugs = [];
    await this.loadAllFiles();
  }

  private async readKnowledgeFile(
    filePath: string,
    username: string,
  ): Promise<KnowledgeFile | null> {
    try {
      const fileContent = await readFile(filePath, "utf-8");
      const { data: frontmatter, content } = matter(fileContent);

      // Extract slug from frontmatter, fallback to filename
      const slug =
        (frontmatter.slug as string | undefined) ??
        filePath.split("/").pop()?.replace(".mdx", "") ??
        "";

      return {
        id: (frontmatter.id as string) || `${username}-${slug}`,
        title: (frontmatter.title as string | undefined) ?? slug,
        description: (frontmatter.description as string | undefined) ?? "",
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
        coverPhoto: frontmatter.coverPhoto as Media | undefined,
        inlinePhotos: frontmatter.inlinePhotos as Media[],
      };
    } catch (error) {
      console.error(`Error reading knowledge file ${filePath}:`, error);
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
