import {
  ImageSchema,
  InsertInferredBookSchema,
  InsertShelfSchema,
  SelectBookSchema,
  SelectFurnitureSchema,
  SelectMyBookSchema,
  SelectShelfSchema,
} from "@sovoli/db/schema";
import { z } from "zod";

import { withPagination } from "./withPagination";

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
  book: SelectBookSchema.nullish(),
  shelf: SelectShelfSchema.nullish(),
});

export const ShelfResponseSchema = SelectShelfSchema.extend({
  furniture: SelectFurnitureSchema.nullish(),
  totalBooks: z.number(),
  images: z.array(ImageSchema).nullish(),
});

export const ShelvesResponseSchema = withPagination(ShelfResponseSchema);

export const MyBooksResponseSchema = withPagination(MyBookResponseSchema);

export const ShelfBooksResponseSchema = withPagination(
  MyBookResponseSchema.omit({ shelf: true }),
).extend({
  shelf: ShelfResponseSchema,
});

export const InsertShelfRequestSchema = InsertShelfSchema.omit({
  ownerId: true,
}).extend({
  myBooks: z
    .array(
      z.object({
        inferredBook: InsertInferredBookSchema.optional(),
        shelfOrder: z.number(),
      }),
    )
    .optional(),
});
