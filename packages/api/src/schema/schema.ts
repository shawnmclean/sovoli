import { schema } from "@sovoli/db";
import {
  InsertShelfSchema,
  SelectMyBookSchema,
  SelectShelfSchema,
} from "@sovoli/db/src/schema";
import { withPagination } from "./withPagination";
import { z } from "zod";

export const ZPaginationRequestQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().lte(30).optional().default(30),
});

export const ZUnsuccessfulResponseSchema = z.object({
  message: z.string(),
});

export const NotFoundSchema = z.object({
  message: z.string(),
});

export const MyBookResponseSchema = SelectMyBookSchema.extend({
  book: schema.SelectBookSchema.nullish(),
  shelf: schema.SelectShelfSchema.nullish(),
});


export const ShelfResponseSchema = SelectShelfSchema.extend({
  furniture: schema.SelectFurnitureSchema.optional(),
  totalBooks: z.number(),
});

export const ShelvesResponseSchema = withPagination(ShelfResponseSchema);

export const MyBooksResponseSchema = withPagination(MyBookResponseSchema);

export const ShelfBooksResponseSchema = withPagination(MyBookResponseSchema.omit({shelf: true}))
  .extend({
    shelf: ShelfResponseSchema
  })


export const InsertShelfRequestSchema = InsertShelfSchema.omit({
  ownerId: true,
}).extend({
  myBooks: z
    .array(
      z.object({
        inferredBook: schema.InsertInferredBookSchema.optional(),
        shelfOrder: z.number(),
      })
    )
    .optional(),
});
