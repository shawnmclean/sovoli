import { readdir } from "fs/promises";
import { join, extname } from "path";
import type { UserSlug } from "./types";

interface Result {
  usersAndSlugs: UserSlug[];
}

export class GetAllUsersAndSlugsQuery {
  resultType?: Result;
}

export class GetAllUsersAndSlugsQueryHandler {
  private readonly usersDir = join(
    process.cwd(),
    "src/modules/data/organisations/users",
  );

  async handle(): Promise<Result> {
    try {
      const usersAndSlugs: UserSlug[] = [];

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
              const slug = file.name.replace(".mdx", "");
              usersAndSlugs.push({
                username,
                slug,
              });
            }
          }
        }
      }

      return { usersAndSlugs };
    } catch (error) {
      console.error("Error reading all users and slugs:", error);
      return { usersAndSlugs: [] };
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
