import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { BooksResponseSchema } from "../../../schema/schema";

const c = initContract();

export const bookContract = c.router({
  listOrSearchBooks: {
    method: "GET",
    path: `/books`,
    query: z.object({
      q: z.string().optional(),
      page: z.coerce.number().optional().default(1),
      pageSize: z.coerce.number().optional().default(30),
    }),
    responses: {
      200: BooksResponseSchema,
    },
    summary: "Search for books by query",
  },
});
