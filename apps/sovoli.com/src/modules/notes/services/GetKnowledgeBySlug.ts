import { KnowledgeFileCache } from "./KnowledgeFileCache";
import type { KnowledgeFile } from "./types";

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
  private cache = KnowledgeFileCache.getInstance();

  async handle(query: GetKnowledgeBySlugQuery): Promise<Result> {
    try {
      // Ensure cache is loaded
      await this.cache.loadAllFiles();

      const knowledge = this.cache.getKnowledgeFileBySlug(
        query.username,
        query.slug,
      );
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
