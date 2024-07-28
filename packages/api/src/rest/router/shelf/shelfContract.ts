import { z } from "zod";
import { initContract } from "@ts-rest/core";
import {
  InsertShelfRequestSchema,
  NotFoundSchema,
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
      404: NotFoundSchema,
      200: ShelfResponseSchema,
    },
    summary: "Get a shelf and it's books by slug",
  },
  putShelf: {
    method: "PUT",
    // TODO: update this to /user/shelves/:slug when auth is in place
    path: `/users/:username/shelves/:slug`,
    pathParams: z.object({
      username: z.coerce.string(),
      slug: z.coerce.string(),
    }),
    body: InsertShelfRequestSchema,
    responses: {
      200: ShelfResponseSchema,
    },
  },
});
