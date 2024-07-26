import { schema } from "@sovoli/db";
import { SelectMyBookSchema, SelectShelfSchema } from "@sovoli/db/src/schema";
import { withPagination } from "./withPagination";

export const MyBookResponseSchema = SelectMyBookSchema.extend({
  book: schema.SelectBookSchema.optional(),
  shelf: schema.SelectShelfSchema.optional(),
}).nullable();

export const MyBooksResponseSchema = withPagination(MyBookResponseSchema);

export const ShelfResponseSchema = SelectShelfSchema.extend({
  furniture: schema.SelectFurnitureSchema.optional(),
  books: MyBookResponseSchema.array().optional(),
}).nullable();

export const ShelvesResponseSchema = withPagination(ShelfResponseSchema);
