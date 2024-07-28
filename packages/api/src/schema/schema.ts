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

export const InsertShelfRequestSchema = InsertShelfSchema.omit({
  ownerId: true,
}).extend({
  books: z.array(
    z.object({
      // if id is provided, it will be used to update the book
      // otherwise, the name will be used to create a new book
      id: z.string().nullable(),
      name: z.string(),
      shelfOrder: z.number(),
    })
  ),
});
