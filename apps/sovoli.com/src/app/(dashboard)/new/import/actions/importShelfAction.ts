"use server";

import { withZod } from "@rvf/zod";
import {
  BatchCreateKnowledges,
  BatchCreateKnowledgesOptions,
} from "@sovoli/api/services/knowledge/batchCreateKnowledges";
import { auth } from "@sovoli/auth";
import { and, db, eq, inArray, schema } from "@sovoli/db";
import { KnowledgeQueryType, KnowledgeType } from "@sovoli/db/schema";
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

    // TODO: move everything here to a service
    interface ShelfMapping {
      id?: string;
      name?: string;
      books: {
        query: string;
        queryType: KnowledgeQueryType;
      }[];
    }

    const shelvesToUpsert: ShelfMapping[] = shelves
      .map((shelf) => {
        const mapping = userMapping?.find((m) => m.from === shelf.name);

        if (mapping || !userMapping) {
          return {
            id: mapping?.to.id,
            name: mapping?.to.name ?? shelf.name,
            books: shelf.books.map((book) => {
              const isIsbnValid = book.isbn && book.isbn.length > 10;
              const query = isIsbnValid
                ? book.isbn
                : `${book.title} ${book.author}`;

              return {
                query: query,
                queryType: isIsbnValid
                  ? KnowledgeQueryType.isbn
                  : KnowledgeQueryType.query,
              };
            }),
          };
        }
      })
      .filter((shelf) => shelf !== undefined);

    console.log("shelvesToUpsert", shelvesToUpsert);

    type OwnedShelfMapping = Omit<ShelfMapping, "id"> & { id: string };
    // check if shelves to update is owned by the user
    const ownedShelves: OwnedShelfMapping[] = shelvesToUpsert.filter(
      (shelf): shelf is OwnedShelfMapping => shelf.id !== undefined,
    );

    const userShelves = await db.query.Knowledge.findMany({
      where: and(
        eq(schema.Knowledge.userId, session.userId),
        inArray(
          schema.Knowledge.id,
          ownedShelves.map((s) => s.id),
        ),
      ),
    });

    const dbOwnedShelfIds = new Set(userShelves.map((shelf) => shelf.id));

    const unownedShelves = ownedShelves.filter(
      (shelf) => !dbOwnedShelfIds.has(shelf.id),
    );

    if (unownedShelves.length > 0) {
      throw new Error(
        `Unauthorized access: The following shelves are not owned by the user - ${unownedShelves
          .map((shelf) => shelf.id)
          .join(", ")}`,
      );
    }

    console.log("ownedShelves", ownedShelves);

    // const shelvesToUpsert =
    //   mapping && mapping.length > 0
    //     ? shelves.filter((shelf) => mapping.some((m) => m.from === shelf.name))
    //     : shelves;

    // const batchCreateKnowledgesOption: BatchCreateKnowledgesOptions = {
    //   authUserId: session.userId,
    //   knowledges: [],
    // };

    // for (const shelf of shelvesToUpsert) {
    //   // add the shelf as a knowledge item
    //   batchCreateKnowledgesOption.knowledges.push({
    //     title: shelf.name,
    //     description: "Shelf created by import",
    //     content: `Created by import from file: ${file.name}`,
    //     type: KnowledgeType.shelf,
    //     isOrigin: true,
    //   });

    //   for (const book of shelf.books) {
    //     // TODO: better validations here
    //     const isIsbnValid = book.isbn.length > 10;
    //     const query = isIsbnValid ? book.isbn : `${book.title} ${book.author}`;
    //     batchCreateKnowledgesOption.knowledges.push({
    //       type: KnowledgeType.book,
    //       query: query,
    //       queryType: isIsbnValid
    //         ? KnowledgeQueryType.isbn
    //         : KnowledgeQueryType.query,
    //     });
    //   }
    // }

    // // TODO: use a transaction to ensure consistency
    // const batchCreateKnowledges = new BatchCreateKnowledges(db);

    // const createdKnowledges = await batchCreateKnowledges.call(
    //   batchCreateKnowledgesOption,
    // );

    // console.log("Created knowledges:", createdKnowledges);
  } catch (e) {
    console.log(e);
  }
}
