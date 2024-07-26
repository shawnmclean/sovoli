import { z } from "zod";
import type { ZodObject, ZodRawShape } from "zod";

const PaginationMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

export function withPagination<T extends ZodRawShape>(schema: ZodObject<T>) {
  return z.object({
    data: schema.array(),
    meta: PaginationMetaSchema,
  });
}
