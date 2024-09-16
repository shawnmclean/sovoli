import { and, count, db, eq, inArray, schema } from "@sovoli/db";
import { tsr } from "@ts-rest/serverless/next";

import {
  MyBookResponseSchema,
  MyBooksResponseSchema,
  PutMyBooksResponseSchema,
} from "../../../schema/schema";
import { UserNotFoundError } from "../../../service/errors";
import { putMyBookQueries } from "../../../service/mybooks";
import { myBookContract } from "./myBookContract";

export const myBookRouter = tsr.router(myBookContract, {
  putMyBooks: async ({ params: { username }, body }) => {
    let myBooks;
    try {
      myBooks = await putMyBookQueries({ username, books: body });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return {
          status: 404,
          body: {
            message: error.message,
          },
        };
      }
      return {
        status: 500,
        body: {
          message: "Unknown error",
        },
      };
    }
    // move the parse outside of the try catch to ensure correct parse error
    return {
      status: 200,
      body: PutMyBooksResponseSchema.parse(myBooks),
    };
  },
  getMyBooks: async ({ params: { username }, query: { page, pageSize } }) => {
    const filter = getMyBooksByUsernameFilter(username);
    const [data, total] = await Promise.all([
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

    return {
      status: 200,
      body: MyBooksResponseSchema.parse({
        data,
        meta: { page, pageSize, total: total[0]?.count },
      }),
    };
  },
  getMyBook: async ({ params: { username, slug } }) => {
    const usernameFilter = getMyBooksByUsernameFilter(username);
    const bookFilter = getMyBooksBySlugFilter(slug);

    const myBook = await db.query.myBooks.findFirst({
      with: {
        book: true,
      },
      where: and(usernameFilter, bookFilter),
    });

    if (!myBook) return { status: 404, body: { message: "Book not found" } };

    return {
      status: 200,
      body: MyBookResponseSchema.parse(myBook),
    };
  },
});

function getMyBooksByUsernameFilter(username: string) {
  return inArray(
    schema.myBooks.ownerId,
    db
      .select({ id: schema.User.id })
      .from(schema.User)
      .where(eq(schema.User.username, username)),
  );
}

function getMyBooksBySlugFilter(slug: string) {
  return inArray(
    schema.myBooks.bookId,
    db
      .select({ id: schema.Book.id })
      .from(schema.Book)
      .where(eq(schema.Book.slug, slug)),
  );
}
