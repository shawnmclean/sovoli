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
      to: z
        .object({
          id: z.string().optional(),
          name: z.string().optional(),
        })
        .refine((data) => (data.id && !data.name) ?? (!data.id && data.name), {
          message: "Either 'id' or 'name' must be provided, but not both.",
        }),
    }),
  )
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
