import type {
  InsertKnowledge,
  InsertKnowledgeConnection,
} from "@sovoli/db/schema";
import { db, eq, schema } from "@sovoli/db";
import {
  ImportStatus,
  KnowledgeConnectionType,
  KnowledgeQueryType,
  KnowledgeType,
} from "@sovoli/db/schema";
import { AbortTaskRunError, task } from "@trigger.dev/sdk/v3";
import chunk from "lodash/chunk";

import type { ImportDataError } from "../lib/schemas";
import { PublishKnowledge } from "~/services/knowledge/publishKnowledge";
import { knowledgeUpsertedEvent } from "~/trigger/";
import { groupCSVBooksByShelves } from "../lib/groupCSVBooksByShelves";
import { parseCSVIntoBooks } from "../lib/parseCSVIntoBooks";
import { importDataSchema } from "../lib/schemas";

export interface ImportTriggerOptions {
  importId: string;
}

export const importTrigger = task({
  id: "import",
  run: async ({ importId }: ImportTriggerOptions, { ctx }) => {
    const importResult = await db.query.Import.findFirst({
      where: eq(schema.Import.id, importId),
    });

    if (!importResult) {
      throw new AbortTaskRunError("Import not found");
    }

    await db
      .update(schema.Import)
      .set({
        triggerDevId: ctx.run.id,
        status: ImportStatus.running,
      })
      .where(eq(schema.Import.id, importId));

    const { csvContent, mapping: userMapping } = importDataSchema.parse(
      importResult.importData,
    );

    try {
      const books = parseCSVIntoBooks(csvContent);
      const shelves = groupCSVBooksByShelves(books);

      interface ShelfMapping {
        books: {
          title: string;
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
              title: `${book.title} by ${book.author}`,
              query: book.isbn,
              queryType: KnowledgeQueryType.isbn,
            };
          } else {
            return {
              title: `${book.title} by ${book.author}`,
              query: `${book.title} ${book.author}`,
              queryType: KnowledgeQueryType.query,
            };
          }
        });

      for (const shelf of shelves) {
        const mapping = userMapping?.find((m) => m.from === shelf.name);
        if (!mapping || mapping.to === "new-shelf") {
          newShelves.push({
            name: shelf.name,
            books: mapBooks(shelf.books),
          });
        } else if (mapping.to && mapping.to !== "do-not-import") {
          existingShelves.push({
            id: mapping.to,
            books: mapBooks(shelf.books),
          });
        }
      }

      let insertedShelves: { id: string }[] = [];
      if (newShelves.length > 0) {
        insertedShelves = await db
          .insert(schema.Knowledge)
          .values(
            newShelves.map((shelf) => ({
              title: shelf.name,
              description: "Shelf created by import",
              type: KnowledgeType.shelf,
              isOrigin: true,
              userId: importResult.userId,
            })),
          )
          .returning({
            id: schema.Knowledge.id,
          });

        const publishKnowledge = new PublishKnowledge();
        for (const shelf of insertedShelves) {
          await publishKnowledge.call({
            authUserId: importResult.userId,
            knowledgeId: shelf.id,
          });
        }
      }

      const booksToInsert: InsertKnowledge[] = [];
      const shelfBookMappings: { shelfId: string; bookIndex: number }[] = [];

      const addBooksToInsert = (
        shelfId: string,
        books: ShelfMapping["books"],
      ) => {
        books.forEach((book) => {
          booksToInsert.push({
            title: book.title,
            type: KnowledgeType.book,
            query: book.query,
            queryType: book.queryType,
            userId: importResult.userId,
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

      let insertedBooks: { id: string; title: string | null }[] = [];
      if (booksToInsert.length > 0) {
        insertedBooks = await db
          .insert(schema.Knowledge)
          .values(booksToInsert)
          .returning({
            id: schema.Knowledge.id,
            title: schema.Knowledge.title,
          });
      }

      const connectionsToInsert: InsertKnowledgeConnection[] =
        shelfBookMappings.map(({ shelfId, bookIndex }) => {
          const bookId = insertedBooks[bookIndex]?.id;
          if (!bookId) {
            throw new Error("Inserted book not found");
          }

          return {
            sourceKnowledgeId: shelfId,
            targetKnowledgeId: bookId,
            type: KnowledgeConnectionType.contains,
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

      const runResults = [];
      for (const chunk of chunks) {
        const result = await knowledgeUpsertedEvent.batchTriggerAndWait(chunk);
        runResults.push(...result.runs);
      }

      const importError: ImportDataError = { message: "", errors: [] };
      runResults.forEach((run, index) => {
        if (!run.ok) {
          const errorMessage =
            run.error instanceof Error ? run.error.message : "Unknown error";
          importError.errors.push({
            book: insertedBooks[index]?.title ?? "",
            message: errorMessage,
          });
        }
      });
      await db
        .update(schema.Import)
        .set({
          status:
            importError.errors.length > 0
              ? ImportStatus.failed
              : ImportStatus.completed,
          errorData: importError,
        })
        .where(eq(schema.Import.id, importId));
    } catch (e) {
      console.log(e);
    }
  },
});
