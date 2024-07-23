import { tsr } from "@ts-rest/serverless/next";
import { eq } from "@sovoli/db";

import { db, schema } from "@sovoli/db";

import { furnitureContract } from "./furnitureContract";

export const furnitureRouter = tsr.router(furnitureContract, {
  getFurniture: async ({ params: { username, slug } }) => {
    const furniture = await db.query.furnitures.findFirst({
      where: eq(schema.furnitures.slug, slug),
    });

    return {
      status: 200,
      body: schema.SelectFurnitureSchema.parse(furniture),
    };
  },
});
