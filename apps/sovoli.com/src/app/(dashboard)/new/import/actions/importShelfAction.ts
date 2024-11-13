"use server";

import { withZod } from "@rvf/zod";
import {
  BatchCreateKnowledges,
  BatchCreateKnowledgesOptions,
} from "@sovoli/api/services/knowledge/batchCreateKnowledges";
import { auth } from "@sovoli/auth";
import { db } from "@sovoli/db";
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
        to: z.object({
          id: z.string().optional(),
          name: z.string().optional(),
        }),
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

    const mapping = result.data.mapping;

    const shelvesToUpsert =
      mapping && mapping.length > 0
        ? shelves.filter((shelf) => mapping.some((m) => m.from === shelf.name))
        : shelves;

    const batchCreateKnowledgesOption: BatchCreateKnowledgesOptions = {
      authUserId: session.userId,
      knowledges: [],
    };

    for (const shelf of shelvesToUpsert) {
      // add the shelf as a knowledge item
      batchCreateKnowledgesOption.knowledges.push({
        title: shelf.name,
        description: "Shelf created by import",
        content: `Created by import from file: ${file.name}`,
        type: KnowledgeType.shelf,
        isOrigin: true,
      });

      for (const book of shelf.books) {
        // TODO: better validations here
        const isIsbnValid = book.isbn.length > 10;
        const query = isIsbnValid ? book.isbn : `${book.title} ${book.author}`;
        batchCreateKnowledgesOption.knowledges.push({
          type: KnowledgeType.book,
          query: query,
          queryType: isIsbnValid
            ? KnowledgeQueryType.isbn
            : KnowledgeQueryType.query,
        });
      }
    }

    // TODO: use a transaction to ensure consistency
    const batchCreateKnowledges = new BatchCreateKnowledges(db);

    const createdKnowledges = await batchCreateKnowledges.call(
      batchCreateKnowledgesOption,
    );

    console.log("Created knowledges:", createdKnowledges);
  } catch (e) {
    console.log(e);
  }
}
