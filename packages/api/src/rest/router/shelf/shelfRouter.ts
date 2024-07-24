import { tsr } from "@ts-rest/serverless/next";
import { db, eq, and, schema, inArray, count } from "@sovoli/db";

import { shelfContract } from "./shelfContract";

export const shelfRouter = tsr.router(shelfContract, {
  getShelves: async ({ params: { username }, query: { page, pageSize } }) => {
    const filter = inArray(
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
    );
    const [data, total] = await Promise.all([
      db.query.shelves.findMany({
        where: filter,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      db.select({ count: count() }).from(schema.shelves).where(filter),
    ]);

    return {
      status: 200,
      body: schema.SelectShelvesShema.parse({
        data,
        meta: { page, pageSize, total: total[0]?.count },
      }),
    };
  },

  getShelf: () => {
    throw new Error("Not implemented");
  },
});
