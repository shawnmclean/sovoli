import { tsr } from "@ts-rest/serverless/next";
import { db, eq, schema, inArray, count, and, sql } from "@sovoli/db";

import { shelfContract } from "./shelfContract";
import {
  ShelfResponseSchema,
  ShelvesResponseSchema,
} from "../../../schema/schema";
import { handleInferredBook } from "./handleBooks";

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
        slug: body.slug,
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

    if (body.myBooks && body.myBooks.length > 0) {
      // TODO: Move this logic into a background job
      // Workflow:
      // 1. iterate over the books and hydrate them (if the book is coming from an inference system, confirm with google books api)
      // a. call the google books api
      // b. if the book is not found, save the error to the myBooks table
      // c. if the book is found,
      //  c.1 find the book in the database and save the id to the myBooks table
      //  c.2 if the book is not found, save the book to the database and save the id to the myBooks table
      // 2. Handle the shelf order logic
      for (const myBook of body.myBooks) {
        if (!myBook.inferredBook) continue;

        try {
          const book = await handleInferredBook(myBook.inferredBook);

          await db
            .insert(schema.myBooks)
            .values({
              name: myBook.inferredBook.title,
              ownerId: user.id,
              shelfId: shelf.id,
              shelfOrder: myBook.shelfOrder,
              inferredBook: { ...myBook.inferredBook },
              bookId: book.id,
              slug: slugify(book.title),
            })
            .onConflictDoUpdate({
              target: [schema.myBooks.slug, schema.myBooks.ownerId],
              set: {
                name: sql.raw(`excluded.${schema.myBooks.name.name}`),
                shelfId: sql.raw(`excluded.${schema.myBooks.shelfId.name}`),
                shelfOrder: sql.raw(
                  `excluded.${schema.myBooks.shelfOrder.name}`
                ),
                inferredBook: sql.raw(
                  `excluded.${schema.myBooks.inferredBook.name}`
                ),
                bookId: sql.raw(`excluded.${schema.myBooks.bookId.name}`),
              },
            });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);

          await db
            .insert(schema.myBooks)
            .values({
              name: myBook.inferredBook.title,
              ownerId: user.id,
              shelfId: shelf.id,
              shelfOrder: myBook.shelfOrder,
              inferredBook: { ...myBook.inferredBook, error: errorMessage },
              slug: slugify(myBook.inferredBook.title),
            })
            .onConflictDoUpdate({
              target: [schema.myBooks.slug, schema.myBooks.ownerId],
              set: {
                name: sql.raw(`excluded.${schema.myBooks.name.name}`),
                shelfId: sql.raw(`excluded.${schema.myBooks.shelfId.name}`),
                shelfOrder: sql.raw(
                  `excluded.${schema.myBooks.shelfOrder.name}`
                ),
                inferredBook: sql.raw(
                  `excluded.${schema.myBooks.inferredBook.name}`
                ),
              },
            });
        }
      }
    }

    return {
      status: 200,
      body: ShelfResponseSchema.parse(shelf),
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

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
