import { z } from "zod";

import { importShelfMappingSchema } from "~/services/import/createShelfImport";

const csvFileSchema = z.instanceof(File).refine(
  (file) => {
    return file.type === "text/csv";
  },
  {
    message: "File must be a CSV",
  },
);

/**
 * For usage with the form action and form
 */
export const formImportShelfSchema = z.object({
  csvFile: csvFileSchema,
  mapping: importShelfMappingSchema,
});
export type FormImportShelfData = z.infer<typeof formImportShelfSchema>;
