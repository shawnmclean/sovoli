import { tsr } from "@ts-rest/serverless/next";
import { db, eq, schema, inArray, count, and, sql } from "@sovoli/db";

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
    const user = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });

    if (!user) return { status: 404, body: { message: "User not found" } };

    const returnedShelves = await db
      .insert(schema.shelves)
      .values({
        name: body.name,
        description: body.description,
        slug: slug,
        furnitureId: body.furnitureId,
        ownerId: user.id,
      })
      .onConflictDoUpdate({
        target: [schema.shelves.slug, schema.shelves.ownerId],
        set: {
          name: sql.raw(`excluded.${schema.shelves.name.name}`),
          description: sql.raw(`excluded.${schema.shelves.description.name}`),
        },
      })
      .returning();

    const shelf = returnedShelves[0];
    if (!shelf)
      return {
        status: 500,
        body: { message: "Shelf created but not returned" },
      };

    // TODO: handle books with id here
    // TODO: move other operations to trigger.dev
    // since it will require calls to google books api

    // const books = body.books.map((book) => {
    //   return {
    //     name: book.name,
    //     slug: slugify(book.name),
    //     ownerId: user.id,
    //     shelfId: shelf.id,
    //     shelfOrder: book.shelfOrder,
    //     bookId: null,
    //   };
    // });

    // await db
    //   .insert(schema.myBooks)
    //   .values(books)
    //   .onConflictDoUpdate({
    //     target: [schema.myBooks.slug, schema.myBooks.ownerId],
    //     set: {
    //       name: sql.raw(`excluded.${schema.myBooks.name.name}`),
    //       description: sql.raw(`excluded.${schema.myBooks.description.name}`),
    //       shelfId: sql.raw(`excluded.${schema.myBooks.shelfId.name}`),
    //       shelfOrder: sql.raw(`excluded.${schema.myBooks.shelfOrder.name}`),
    //     },
    //   });

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

// function slugify(str: string) {
//   return str
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .replace(/^-+/, "")
//     .replace(/-+$/, "");
// }
