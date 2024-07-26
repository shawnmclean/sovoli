import { schema } from "@sovoli/db";
import {
  InsertShelfSchema,
  SelectMyBookSchema,
  SelectShelfSchema,
} from "@sovoli/db/src/schema";
import { withPagination } from "./withPagination";
import { z } from "zod";

export const NotFoundSchema = z.object({
  message: z.string(),
});

export const MyBookResponseSchema = SelectMyBookSchema.extend({
  book: schema.SelectBookSchema.optional(),
  shelf: schema.SelectShelfSchema.optional(),
});

export const MyBooksResponseSchema = withPagination(MyBookResponseSchema);

export const ShelfResponseSchema = SelectShelfSchema.extend({
  furniture: schema.SelectFurnitureSchema.optional(),
  books: MyBookResponseSchema.array().optional(),
});

export const ShelvesResponseSchema = withPagination(ShelfResponseSchema);

export const InsertShelfRequestSchema = InsertShelfSchema.extend({
  // TODO: add array of books here
});
