"use server";

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
    .object({
      shelves: z
        .array(
          z.object({
            from: z.string(),
            to: z.object({
              id: z.string().optional(),
              name: z.string().optional(),
            }),
          }),
        )
        .min(1),
    })
    .optional(),
});

export async function importShelfAction(formData: FormData) {
  console.log(formData);
  const data = Object.fromEntries(formData);
  console.log(data);
  const validatedFields = importShelfSchema.safeParse(data);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const file = data.csvFile as File;
    const csvContent = await file.text();
    const books = parseCSVIntoBooks(csvContent);
    const groupedBooks = groupCSVBooksByShelves(books);
    console.log(groupedBooks);
  } catch (e) {
    console.log(e);
  }
}
