"use server";

import type {
  InsertKnowledge,
  InsertKnowledgeConnection,
} from "@sovoli/db/schema";
import { withZod } from "@rvf/zod";
import { knowledgeUpsertedEvent } from "@sovoli/api/trigger";
import { auth } from "@sovoli/auth";
import { and, db, eq, inArray, schema } from "@sovoli/db";
import {
  KnowledgeConnectionType,
  KnowledgeQueryType,
  KnowledgeType,
} from "@sovoli/db/schema";
import chunk from "lodash/chunk";
import { z } from "zod";

import { groupCSVBooksByShelves } from "../lib/groupCSVBooksByShelves";
import { parseCSVIntoBooks } from "../lib/parseCSVIntoBooks";

const csvFileSchema = z.instanceof(File).refine(
  (file) => {
    return file.type === "text/csv";
  },
  {
    message: "File must be a CSV",
  },
);
const importShelfSchema = z.object({
  csvFile: csvFileSchema,
  mapping: z
    .array(
      z.object({
        from: z.string(),
        to: z
          .object({
            id: z.string().optional(),
            name: z.string().optional(),
          })
          .refine(
            (data) => (data.id && !data.name) ?? (!data.id && data.name),
            {
              message: "Either 'id' or 'name' must be provided, but not both.",
            },
          ),
      }),
    )
    .optional(),
});

const validator = withZod(importShelfSchema);

export async function importShelfAction(formData: FormData) {
  const session = await auth();
  if (!session) {
    return {
      errors: ["You must be logged in to import shelves"],
    };
  }

  const result = await validator.validate(formData);

  if (result.error) {
    console.error(result.error.fieldErrors);
    return {
      errors: result.error.fieldErrors,
    };
  }

  try {
    const file = result.data.csvFile;
    const csvContent = await file.text();
    const books = parseCSVIntoBooks(csvContent);
    const shelves = groupCSVBooksByShelves(books);

    const userMapping = result.data.mapping;

    // authorization check for existing shelves
    const existingShelfIds =
      userMapping?.map((m) => m.to.id).filter((id) => id != null) ?? [];
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
        throw new Error(
          `You are not authorized to modify the following shelves: ${unauthorizedShelves.join(", ")}`,
        );
      }
    }

    // TODO: move everything here to a background service
    interface ShelfMapping {
      books: {
        query: string;
        queryType: KnowledgeQueryType;
      }[];
    }
    type NewShelfMapping = ShelfMapping & { name: string };
    type ExistingShelfMapping = ShelfMapping & { id: string };

    const newShelves: NewShelfMapping[] = [];
    const existingShelves: ExistingShelfMapping[] = [];

    const mapBooks = (
      books: { isbn?: string; title: string; author: string }[],
    ) =>
      books.map((book) => {
        if (book.isbn && book.isbn.length > 10) {
          return {
            query: book.isbn,
            queryType: KnowledgeQueryType.isbn,
          };
        } else {
          return {
            query: `${book.title} ${book.author}`,
            queryType: KnowledgeQueryType.query,
          };
        }
      });

    for (const shelf of shelves) {
      const mapping = userMapping?.find((m) => m.from === shelf.name);

      if (mapping?.to.id) {
        existingShelves.push({
          id: mapping.to.id,
          books: mapBooks(shelf.books),
        });
      } else {
        newShelves.push({
          name: shelf.name,
          books: mapBooks(shelf.books),
        });
      }
    }

    const insertedShelves = await db
      .insert(schema.Knowledge)
      .values(
        newShelves.map((shelf) => ({
          title: shelf.name,
          description: "Shelf created by import",
          type: KnowledgeType.shelf,
          isOrigin: true,
          userId: session.userId,
        })),
      )
      .returning({
        id: schema.Knowledge.id,
      });

    const booksToInsert: InsertKnowledge[] = [];
    const shelfBookMappings: { shelfId: string; bookIndex: number }[] = [];

    const addBooksToInsert = (
      shelfId: string,
      books: { query: string; queryType: KnowledgeQueryType }[],
    ) => {
      books.forEach((book) => {
        booksToInsert.push({
          type: KnowledgeType.book,
          query: book.query,
          queryType: book.queryType,
          userId: session.userId,
        });

        // Store the mapping of this book to its shelf ID
        shelfBookMappings.push({
          shelfId,
          bookIndex: booksToInsert.length - 1,
        });
      });
    };

    newShelves.forEach((shelf, shelfIndex) => {
      const shelfId = insertedShelves[shelfIndex]?.id;
      if (!shelfId) {
        throw new Error("Inserted shelf not found");
      }
      addBooksToInsert(shelfId, shelf.books);
    });

    existingShelves.forEach((shelf) => {
      addBooksToInsert(shelf.id, shelf.books);
    });

    const insertedBooks = await db
      .insert(schema.Knowledge)
      .values(booksToInsert)
      .returning({
        id: schema.Knowledge.id,
      });

    const connectionsToInsert: InsertKnowledgeConnection[] =
      shelfBookMappings.map(({ shelfId, bookIndex }) => {
        const bookId = insertedBooks[bookIndex]?.id;
        if (!bookId) {
          throw new Error("Inserted book not found");
        }

        return {
          sourceKnowledgeId: shelfId,
          targetKnowledgeId: bookId,
          type: KnowledgeConnectionType.collection,
        };
      });

    await db.insert(schema.KnowledgeConnection).values(connectionsToInsert);

    console.log(`inserted ${insertedBooks.length} books`);
    console.log(`inserted ${connectionsToInsert.length} connections`);

    // batch these calls by 100 max
    const payload = insertedBooks.map((b) => ({
      payload: { knowledgeId: b.id },
    }));
    const chunks = chunk(payload, 100);

    await Promise.all(
      chunks.map((chunk) => knowledgeUpsertedEvent.batchTrigger(chunk)),
    );
  } catch (e) {
    console.log(e);
  }
}
