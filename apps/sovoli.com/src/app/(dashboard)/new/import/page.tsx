import { auth } from "@sovoli/auth";
import { and, db, eq, inArray, schema } from "@sovoli/db";

import { ShelfImportForm } from "./components/ShelfImportForm";

export default async function ImportPage() {
  const session = await auth();
  if (!session) {
    return {
      errors: ["You must be logged in to import shelves"],
    };
  }

  const existingCollections = await db.query.Knowledge.findMany({
    extras: (table, { sql }) => ({
      itemCount: sql<number>`COUNT(*) OVER()`.as("itemCount"),
    }),
    where: and(
      eq(schema.Knowledge.userId, session.userId),
      inArray(schema.Knowledge.type, ["collection", "shelf"]),
    ),
  });

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <ShelfImportForm userCollections={existingCollections} />
    </div>
  );
}
