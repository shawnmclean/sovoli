import { tsr } from "@ts-rest/serverless/next";
import { db, eq, and, schema, inArray, count } from "@sovoli/db";

import { myBookContract } from "./myBookContract";

export const myBookRouter = tsr.router(myBookContract, {
  getMyBooks: async ({ params: { username }, query: { page, pageSize } }) => {
    const filter = getBooksByUsernameFilter(username);
    const [data, total] = await Promise.all([
      db.query.myBooks.findMany({
        with: {
          book: true,
          shelf: true,
        },
        where: filter,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      db.select({ count: count() }).from(schema.myBooks).where(filter),
    ]);

    return {
      status: 200,
      body: schema.SelectMyBooksSchema.parse({
        data,
        meta: { page, pageSize, total: total[0]?.count },
      }),
    };
  },
  getMyBook: async ({ params: { username, slug } }) => {
    const filter = getBooksByUsernameFilter(username);

    const myBook = await db.query.myBooks.findFirst({
      with: {
        shelf: true,
        book: true,
      },
      where: and(filter, eq(schema.myBooks.slug, slug)),
    });

    if (!myBook) return { status: 404, body: { message: "Book not found" } };

    return {
      status: 200,
      body: schema.SelectMyBookSchema.parse(myBook),
    };
  },
});

function getBooksByUsernameFilter(username: string) {
  return inArray(
    schema.myBooks.ownerId,
    db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.username, username))
  );
}
