import { and, count, db, eq, inArray, schema, sql } from "@sovoli/db";
import { tsr } from "@ts-rest/serverless/next";

import {
  ShelfBooksResponseSchema,
  ShelfResponseSchema,
  ShelvesResponseSchema,
} from "../../../schema/schema";
import { helloWorld } from "../../../trigger";
import { handleInferredBook } from "./handleBooks";
import { shelfContract } from "./shelfContract";

export const shelfRouter = tsr.router(shelfContract, {
  getShelves: async ({ params: { username }, query: { page, pageSize } }) => {
    const filter = getShelvesByOwnerUsernameFilter(username);
    const [data, total] = await Promise.all([
      db.query.shelves.findMany({
        with: {
          furniture: true,
          books: {
            with: { book: true },
          },
        },
        extras: {
          totalBooks: sql<number>`(
          SELECT CAST(COUNT(*) AS INTEGER)
          FROM ${schema.myBooks} 
          WHERE shelf_id = ${schema.shelves.id}
        )`.as("total_books"),
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

  getShelfBooks: async ({
    params: { username, slug },
    query: { page, pageSize },
  }) => {
    let shelf;
    try {
      shelf = await fetchShelf(username, slug);
    } catch (error) {
      return {
        status: 404,
        body: {
          message:
            error instanceof Error
              ? error.message
              : "shelf does not exist for this username",
        },
      };
    }

    const filter = getBookOnShelfByOwnerUsernameFilter(username, slug);
    const [data, total] = await Promise.all([
      db.query.myBooks.findMany({
        with: {
          book: true,
        },
        where: filter,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      db.select({ count: count() }).from(schema.myBooks).where(filter),
    ]);

    const response = ShelfBooksResponseSchema.parse({
      shelf,
      data,
      meta: { page, pageSize, total: total[0]?.count },
    });

    return {
      status: 200,
      body: response,
    };
  },

  getShelf: async ({ params: { username, slug } }) => {
    await helloWorld.trigger({ message: `getShelf: ${username}/${slug}` });
    try {
      const shelf = await fetchShelf(username, slug);
      return {
        status: 200,
        body: ShelfResponseSchema.parse(shelf),
      };
    } catch (error) {
      return {
        status: 404,
        body: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  },

  putShelf: async ({ params: { username }, body }) => {
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
                  `excluded.${schema.myBooks.shelfOrder.name}`,
                ),
                inferredBook: sql.raw(
                  `excluded.${schema.myBooks.inferredBook.name}`,
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
                  `excluded.${schema.myBooks.shelfOrder.name}`,
                ),
                inferredBook: sql.raw(
                  `excluded.${schema.myBooks.inferredBook.name}`,
                ),
              },
            });
        }
      }
    }

    return {
      status: 200,
      body: ShelfBooksResponseSchema.parse(shelf),
    };
  },
});

const fetchShelf = async (username: string, slug: string) => {
  const filter = getShelvesByOwnerUsernameFilter(username, slug);
  const shelf = await db.query.shelves.findFirst({
    with: {
      furniture: true,
    },
    extras: {
      totalBooks: sql<number>`(
        SELECT CAST(COUNT(*) AS INTEGER)
        FROM ${schema.myBooks}
        WHERE shelf_id = ${schema.shelves.id}
      )`.as("total_books"),
    },
    where: filter,
  });

  if (!shelf) throw new Error("Shelf not found");

  return ShelfResponseSchema.parse(shelf);
};

function getBookOnShelfByOwnerUsernameFilter(
  username: string,
  shelfSlug?: string,
) {
  return inArray(
    schema.myBooks.shelfId,
    db
      .select({ id: schema.shelves.id })
      .from(schema.shelves)
      .where(getShelvesByOwnerUsernameFilter(username, shelfSlug)),
  );
}

function getShelvesByOwnerUsernameFilter(username: string, shelfSlug?: string) {
  if (shelfSlug) {
    return and(onUserShelf(username), eq(schema.shelves.slug, shelfSlug));
  } else {
    return onUserShelf(username);
  }
}

function onUserShelf(username: string) {
  return inArray(
    schema.shelves.ownerId,
    db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.username, username)),
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
