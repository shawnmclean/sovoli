import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  MyBookResponseSchema,
  MyBooksResponseSchema,
  NotFoundSchema,
  PutMyBooksResponseSchema,
} from "../../../schema/schema";

const c = initContract();

export const myBookContract = c.router({
  putMyBooks: {
    method: "PUT",
    path: `/users/:username/mybooks`,
    pathParams: z.object({
      username: z.coerce.string(),
    }),
    body: z
      .object({
        query: z.string().optional(),
        isbn: z.string().optional(),
        shelfId: z.number().optional(),
      })
      .array(),
    responses: {
      200: PutMyBooksResponseSchema,
    },
  },
  getMyBooks: {
    method: "GET",
    path: `/users/:username/mybooks`,
    pathParams: z.object({
      username: z.coerce.string(),
    }),
    query: z.object({
      page: z.coerce.number().optional().default(1),
      pageSize: z.coerce.number().optional().default(30),
    }),
    responses: {
      200: MyBooksResponseSchema,
    },
    summary: "Get shelves by username",
  },
  getMyBook: {
    method: "GET",
    path: `/users/:username/mybooks/:slug`,
    pathParams: z.object({
      username: z.coerce.string(),
      slug: z.coerce.string(),
    }),
    responses: {
      404: NotFoundSchema,
      200: MyBookResponseSchema,
    },
    summary: "Get the user's book by slug",
  },
});
