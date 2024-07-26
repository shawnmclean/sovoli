import { tsr } from "@ts-rest/serverless/next";
import { db, eq, schema, inArray, count, and } from "@sovoli/db";

import { shelfContract } from "./shelfContract";
import {
  ShelfResponseSchema,
  ShelvesResponseSchema,
} from "../../../schema/schema";

export const shelfRouter = tsr.router(shelfContract, {
  getShelves: async ({ params: { username }, query: { page, pageSize } }) => {
    const filter = getShelvesByUsernameFilter(username);
    const [data, total] = await Promise.all([
      db.query.shelves.findMany({
        with: {
          furniture: true,
          books: {
            with: { book: true },
          },
        },
        where: filter,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      db.select({ count: count() }).from(schema.shelves).where(filter),
    ]);

    return {
      status: 200,
      body: ShelvesResponseSchema.parse({
        data,
        meta: { page, pageSize, total: total[0]?.count },
      }),
    };
  },

  getShelf: async ({ params: { username, slug } }) => {
    const filter = getShelvesByUsernameFilter(username);
    const shelf = await db.query.shelves.findFirst({
      with: {
        furniture: true,
        books: {
          with: { book: true },
        },
      },
      where: and(filter, eq(schema.shelves.slug, slug)),
    });

    if (!shelf) return { status: 404, body: { message: "Shelf not found" } };

    return {
      status: 200,
      body: ShelfResponseSchema.parse(shelf),
    };
  },

  putShelf: async ({ params: { username, slug }, body }) => {
    // TODO: authorize the user > username
    // TODO: upsert operation
    console.log({ username, slug, body });
    return {
      status: 200,
      body: ShelfResponseSchema.parse(body),
    };
  },
});

function getShelvesByUsernameFilter(username: string) {
  return inArray(
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
}
