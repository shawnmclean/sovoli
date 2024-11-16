import { auth } from "@sovoli/auth";
import { and, db, eq, inArray, isNotNull, ne, schema } from "@sovoli/db";

import { ShelfImportForm } from "./components/ShelfImportForm";

export default async function ImportPage() {
  const session = await auth();
  if (!session) {
    return {
      errors: ["You must be logged in to import shelves"],
    };
  }

  const existingCollections = await db.query.Knowledge.findMany({
    extras: (_table, { sql }) => ({
      itemCount: sql<number>`COUNT(*) OVER()`.as("itemCount"),
    }),
    where: and(
      isNotNull(schema.Knowledge.title),
      ne(schema.Knowledge.title, ""),
      eq(schema.Knowledge.userId, session.userId),
      inArray(schema.Knowledge.type, ["collection", "shelf"]),
    ),
  });

  const collections = existingCollections.map((collection) => ({
    id: collection.id,
    title: collection.title ?? "unknown",
    type: collection.type,
    itemCount: collection.itemCount,
  }));

  return (
    <div className="min-h-screen dark:bg-black">
      <ShelfImportForm userCollections={collections} />
    </div>
  );
}
