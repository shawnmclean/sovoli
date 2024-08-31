import { count, db, eq, inArray, schema, sql } from "@sovoli/db";
import { SelectUserSchema } from "@sovoli/db/schema";
import { tsr } from "@ts-rest/serverless/fetch";

import { GetUserMyBooksProfileResponseSchema } from "./schema";
import { userContract } from "./userContract";

export const userRouter = tsr.router(userContract, {
  getUser: async ({ params: { username } }) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });

    if (!user) return { status: 404, body: { message: "User not found" } };

    return {
      status: 200,
      body: SelectUserSchema.parse(user),
    };
  },
  getUserMyBooksProfile: async ({
    params: { username },
    query: { page, pageSize },
  }) => {
    const filter = getMyBooksByUsernameFilter(username);
    const [user, mybooks, mybooksTotal] = await Promise.all([
      db.query.users.findFirst({
        where: eq(schema.users.username, username),
        with: {
          shelves: {
            extras: {
              totalBooks: sql<number>`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM ${schema.myBooks}
                WHERE shelf_id = ${schema.shelves.id}
              )`.as("total_books"),
            },
          },
        },
      }),
      db.query.myBooks.findMany({
        with: {
          book: true,
        },
        where: filter,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      db.select({ count: count() }).from(schema.myBooks).where(filter),
    ]);

    if (!user) return { status: 404, body: { message: "User not found" } };

    return {
      status: 200,
      body: GetUserMyBooksProfileResponseSchema.parse({
        ...user,
        myBooks: {
          data: mybooks,
          meta: { page, pageSize, total: mybooksTotal[0]?.count },
        },
      }),
    };
  },
});

function getMyBooksByUsernameFilter(username: string) {
  return inArray(
    schema.myBooks.ownerId,
    db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.username, username)),
  );
}
