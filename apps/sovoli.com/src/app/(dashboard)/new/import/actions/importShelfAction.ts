"use server";

import { redirect } from "next/navigation";
import { withZod } from "@rvf/zod";
import { auth } from "@sovoli/auth";
import { and, db, eq, inArray, schema } from "@sovoli/db";
import { ImportStatus } from "@sovoli/db/schema";

import type { ImportData } from "../lib/schemas";
import { importTrigger } from "~/trigger/importTrigger";
import { formImportShelfSchema } from "../lib/schemas";

export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(formImportShelfSchema);

export async function importShelfAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    return {
      status: "error",
      message: "You must be logged in to import shelves",
    };
  }

  const result = await validator.validate(formData);

  if (result.error) {
    console.error(result.error.fieldErrors);
    return {
      status: "error",
      message: "Failed to import shelves",
      errors: result.error.fieldErrors,
    };
  }

  const userMapping = result.data.mapping;

  // authorization check for existing shelves
  const existingShelfIds =
    userMapping
      ?.map((m) => m.to)
      .filter((id) => id !== "do-not-import" && id !== "new-shelf") ?? [];
  if (existingShelfIds.length > 0) {
    const userShelvesFromDb = await db.query.Knowledge.findMany({
      where: and(
        eq(schema.Knowledge.userId, session.userId),
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

  const file = result.data.csvFile;
  const csvContent = await file.text();

  const importData: ImportData = {
    mapping: userMapping,
    csvContent,
  };

  const importResults = await db
    .insert(schema.Import)
    .values({
      userId: session.userId,
      status: ImportStatus.pending,
      source: "goodreads", //TODO detect this from the file or client
      importData,
    })
    .returning({ id: schema.Import.id });

  const importId = importResults[0]?.id;
  if (!importId) {
    throw new Error("Inserted import id not returned");
  }

  const trigger = await importTrigger.trigger({
    importId,
  });

  const updatedImportRestuls = await db
    .update(schema.Import)
    .set({
      triggerDevId: trigger.id,
    })
    .where(eq(schema.Import.id, importId))
    .returning();

  const importRestult = updatedImportRestuls[0];
  if (!importRestult) {
    throw new Error("Import not found");
  }
  redirect("/settings/imports");
}
