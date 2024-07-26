import { z } from "zod";
import type { ZodType, ZodTypeDef } from "zod";

const PaginationMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

export function withPagination<T extends ZodType<any, ZodTypeDef>>(schema: T) {
  return z.object({
    data: schema.array(),
    meta: PaginationMetaSchema,
  });
}
