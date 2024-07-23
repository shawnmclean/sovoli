import { tsr } from "@ts-rest/serverless/next";
import { db, eq, and, schema, inArray } from "@sovoli/db";

import { furnitureContract } from "./furnitureContract";

export const furnitureRouter = tsr.router(furnitureContract, {
  getFurniture: async ({ params: { username, slug } }) => {
    const furniture = await db.query.furnitures.findFirst({
      where: and(
        eq(schema.furnitures.slug, slug),
        inArray(
          schema.furnitures.ownerId,
          db
            .select({ id: schema.users.id })
            .from(schema.users)
            .where(eq(schema.users.username, username))
        )
      ),
    });

    if (!furniture)
      return { status: 404, body: { message: "Furniture not found" } };

    return {
      status: 200,
      body: schema.SelectFurnitureSchema.parse(furniture),
    };
  },
});
