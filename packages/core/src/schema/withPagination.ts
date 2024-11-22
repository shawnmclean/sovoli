import type { ZodObject, ZodRawShape } from "zod";
import { z } from "zod";

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
