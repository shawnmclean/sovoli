import type { UserSlug } from "./types";
import { KnowledgeFileCache } from "./KnowledgeFileCache";

interface Result {
  usersAndSlugs: UserSlug[];
}

export class GetAllUsersAndSlugsQuery {
  resultType?: Result;
}

export class GetAllUsersAndSlugsQueryHandler {
  private cache = KnowledgeFileCache.getInstance();

  async handle(): Promise<Result> {
    try {
      // Ensure cache is loaded
      await this.cache.loadAllFiles();

      const usersAndSlugs = this.cache.getUserSlugs();
      return { usersAndSlugs };
    } catch (error) {
      console.error("Error reading all users and slugs:", error);
      return { usersAndSlugs: [] };
    }
  }
}
