import { tsr } from "@ts-rest/serverless/next";
import { db, eq, and, schema, inArray } from "@sovoli/db";

import { shelfContract } from "./shelfContract";

export const shelfRouter = tsr.router(shelfContract, {
  getShelves: async ({ params: { username } }) => {
    const shelves = await db.query.shelves.findMany({
      with: {
        books: true,
      },
      where: and(
        inArray(
          schema.shelves.furnitureId,
          db
            .select({ id: schema.furnitures.id })
            .from(schema.furnitures)
            .where(
              inArray(
                schema.furnitures.ownerId,
                db
                  .select({ id: schema.users.id })
                  .from(schema.users)
                  .where(eq(schema.users.username, username))
              )
            )
        )
      ),
    });

    return {
      status: 200,
      body: schema.SelectShelfSchema.array().parse(shelves),
    };
  },

  getShelf: ({}) => {
    throw new Error("Not implemented");
  },
});
