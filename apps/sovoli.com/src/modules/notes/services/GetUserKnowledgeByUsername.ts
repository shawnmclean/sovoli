import { KnowledgeFileCache } from "./KnowledgeFileCache";
import type { UserKnowledge } from "./types";

interface Result {
  userKnowledge: UserKnowledge | null;
}

export class GetUserKnowledgeByUsernameQuery {
  resultType?: Result;

  constructor(public readonly username: string) {}
}

export class GetUserKnowledgeByUsernameQueryHandler {
  private cache = KnowledgeFileCache.getInstance();

  async handle(query: GetUserKnowledgeByUsernameQuery): Promise<Result> {
    try {
      // Ensure cache is loaded
      await this.cache.loadAllFiles();

      const knowledgeItems = this.cache.getKnowledgeFilesByUsername(
        query.username,
      );

      if (knowledgeItems.length === 0) {
        return { userKnowledge: null };
      }

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
}
