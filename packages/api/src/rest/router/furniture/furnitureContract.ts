import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { schema } from "@sovoli/db";

const c = initContract();

export const furnitureContract = c.router({
  getFurniture: {
    method: "GET",
    path: `/users/:username/furnitures/:slug`,
    pathParams: z.object({
      username: z.coerce.string(),
      slug: z.coerce.string(),
    }),
    responses: {
      200: schema.SelectFurnitureSchema.nullable(),
    },
    summary: "Get a furniture by slug",
  },
});
