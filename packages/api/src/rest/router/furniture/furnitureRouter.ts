import { tsr } from "@ts-rest/serverless/next";
import { eq } from "@sovoli/db";

import { db, schema } from "@sovoli/db";

import { furnitureContract } from "./furnitureContract";

export const furnitureRouter = tsr.router(furnitureContract, {
  getFurniture: async ({ params: { username, slug } }) => {
    const furniture = await db.query.furnitures.findFirst({
      where: eq(schema.furnitures.slug, slug),
    });

    if (!furniture)
      return { status: 404, body: { message: "Furniture not found" } };

    return {
      status: 200,
      body: schema.SelectFurnitureSchema.parse(furniture),
    };
  },
});
