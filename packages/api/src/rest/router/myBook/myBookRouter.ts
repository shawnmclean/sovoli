import { tsr } from "@ts-rest/serverless/next";
import { db, eq, and, schema, inArray } from "@sovoli/db";

import { myBookContract } from "./myBookContract";

export const myBookRouter = tsr.router(myBookContract, {
  getMyBook: async ({ params: { username, slug } }) => {
    const furniture = await db.query.myBooks.findFirst({
      where: and(
        eq(schema.myBooks.slug, slug),
        inArray(
          schema.myBooks.ownerId,
          db
            .select({ id: schema.users.id })
            .from(schema.users)
            .where(eq(schema.users.username, username))
        )
      ),
    });

    if (!furniture) return { status: 404, body: { message: "Book not found" } };

    return {
      status: 200,
      body: schema.SelectMyBookSchema.parse(furniture),
    };
  },
});
