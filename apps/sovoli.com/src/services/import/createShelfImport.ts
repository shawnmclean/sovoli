import { and, db, eq, inArray, schema } from "@sovoli/db";
import { ImportStatus } from "@sovoli/db/schema";
import { z } from "zod";

import { importTrigger } from "~/trigger/importTrigger";
import { BaseService } from "../baseService";

export const importShelfMappingSchema = z
  .array(
    z.object({
      from: z.string(),
      to: z.union([
        z.literal("do-not-import"), // Option 1: "do-not-import"
        z.literal("new-shelf"), // Option 2: "new-shelf"
        z.string().min(1), // Option 3: Non-empty string (for valid existing shelf id)
      ]),
    }),
  )
  .refine((mapping) => mapping.some((m) => m.to !== "do-not-import"), {
    message: "At least one mapping must be non-do-not-import",
  })
  .optional();

export const importShelfDataSchema = z.object({
  mapping: importShelfMappingSchema,
  csvContent: z.string(),
});
export type ImportData = z.infer<typeof importShelfDataSchema>;

export interface CreateShelfImportOptions {
  authUserId: string;
  mapping: z.infer<typeof importShelfMappingSchema>;
  csvContent: string;
}

export class CreateShelfImport extends BaseService {
  public async call({
    authUserId,
    mapping,
    csvContent,
  }: CreateShelfImportOptions) {
    // authorization check for existing shelves
    const existingShelfIds =
      mapping
        ?.map((m) => m.to)
        .filter((id) => id !== "do-not-import" && id !== "new-shelf") ?? [];
    if (existingShelfIds.length > 0) {
      const userShelvesFromDb = await db.query.Knowledge.findMany({
        where: and(
          eq(schema.Knowledge.userId, authUserId),
          inArray(schema.Knowledge.id, existingShelfIds),
        ),
      });
      // Get the IDs of shelves the user is authorized to modify
      const userShelvesIdsFromDb = userShelvesFromDb.map((shelf) => shelf.id);

      // Find any shelves in existingShelfIds that the user doesn't own
      const unauthorizedShelves = existingShelfIds.filter(
        (shelfId) => !userShelvesIdsFromDb.includes(shelfId),
      );
      // If there are any unauthorized shelves, throw an error
      if (unauthorizedShelves.length > 0) {
        return {
          status: "error",
          message: `You are not authorized to modify the following shelves: ${unauthorizedShelves.join(", ")}`,
        };
      }
    }

    const importData: ImportData = {
      mapping,
      csvContent,
    };

    const importResults = await db
      .insert(schema.Import)
      .values({
        userId: authUserId,
        status: ImportStatus.pending,
        source: "goodreads", //TODO detect this from the file or client
        importData,
      })
      .returning({ id: schema.Import.id });

    const importId = importResults[0]?.id;
    if (!importId) {
      throw new Error("Inserted import id not returned");
    }

    await importTrigger.trigger({
      importId,
    });

    return {
      id: importId,
    };
  }
}
