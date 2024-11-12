"use server";

import { withZod } from "@rvf/zod";
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
  mapping: z.array(
    z.object({
      from: z.string(),
      to: z.object({
        id: z.string().optional(),
        name: z.string().optional(),
      }),
    }),
  ),
});

const validator = withZod(importShelfSchema);

export async function importShelfAction(formData: FormData) {
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
    const groupedBooks = groupCSVBooksByShelves(books);
    console.log(groupedBooks.length);
  } catch (e) {
    console.log(e);
  }
}
