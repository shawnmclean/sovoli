import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { schema } from "@sovoli/db";
import {
  ShelfResponseSchema,
  ShelvesResponseSchema,
} from "../../../schema/schema";

const c = initContract();

export const shelfContract = c.router({
  getShelves: {
    method: "GET",
    path: `/users/:username/shelves`,
    pathParams: z.object({
      username: z.coerce.string(),
    }),
    query: z.object({
      page: z.coerce.number().optional().default(1),
      pageSize: z.coerce.number().optional().default(30),
    }),
    responses: {
      200: ShelvesResponseSchema,
    },
    summary: "Get shelves by username",
  },
  getShelf: {
    method: "GET",
    path: `/users/:username/shelves/:slug`,
    pathParams: z.object({
      username: z.coerce.string(),
      slug: z.coerce.string(),
    }),
    responses: {
      200: ShelfResponseSchema,
    },
    summary: "Get a shelf and it's books by slug",
  },
});
