import { z } from "zod";

const csvFileSchema = z.instanceof(File).refine(
  (file) => {
    return file.type === "text/csv";
  },
  {
    message: "File must be a CSV",
  },
);
const mappingSchema = z
  .array(
    z.object({
      from: z.string(),
      to: z.union([
        z.literal("do-not-import"), // Option 1: "do-not-import"
        z.literal("new-shelf"), // Option 2: "new-shelf"
        z.string().min(1), // Option 3: Non-empty string (for valid existing shelf id)
      ]),
    }),
  )
  .refine((mapping) => mapping.some((m) => m.to !== "do-not-import"), {
    message: "At least one mapping must be non-do-not-import",
  })
  .optional();

/**
 * For usage with the form action and form
 */
export const formImportShelfSchema = z.object({
  csvFile: csvFileSchema,
  mapping: mappingSchema,
});
export type FormImportShelfData = z.infer<typeof formImportShelfSchema>;

/**
 * For usage with storing the import data in the database
 */
export const importDataSchema = z.object({
  mapping: mappingSchema,
  csvContent: z.string(),
});
export type ImportData = z.infer<typeof importDataSchema>;

export const importDataErrorSchema = z.object({
  message: z.string(),
  errors: z
    .object({
      book: z.string().optional(),
      message: z.string().optional(),
    })
    .array(),
});

export type ImportDataError = z.infer<typeof importDataErrorSchema>;
