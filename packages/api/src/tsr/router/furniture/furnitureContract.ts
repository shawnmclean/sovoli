import { SelectFurnitureSchema } from "@sovoli/db/schema";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

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
      200: SelectFurnitureSchema.nullable(),
    },
    summary: "Get a furniture by slug",
  },
});
