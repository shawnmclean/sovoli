import { SelectBookSchema, SelectMyBookSchema } from "@sovoli/db/schema";
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

export const BooksResponseSchema = withPagination(SelectBookSchema);

export const MyBookResponseSchema = SelectMyBookSchema.extend({
  book: SelectBookSchema.nullish(),
});

export const MyBooksResponseSchema = withPagination(MyBookResponseSchema);
export const PutMyBooksResponseSchema = MyBookResponseSchema.array();

export const InferredBookSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  isbn: z.string().optional(),
});
