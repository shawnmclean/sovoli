import { count, db, schema } from "@sovoli/db";
import { tsr } from "@ts-rest/serverless/next";

import { BooksResponseSchema } from "../../../schema";
import { searchBooksByQuery } from "../../../service/books";
import { bookContract } from "./bookContract";

export const bookRouter = tsr.router(bookContract, {
  listOrSearchBooks: async ({ query: { q, page, pageSize } }) => {
    if (q) {
      // search by query
      const { books, total } = await searchBooksByQuery({
        query: q,
        page: page,
        pageSize: pageSize,
      });

      return {
        status: 200,
        body: BooksResponseSchema.parse({
          data: books,
          meta: { page, pageSize, total },
        }),
      };
    } else {
      // list all books
      const [data, total] = await Promise.all([
        db.query.books.findMany({
          limit: pageSize,
          offset: (page - 1) * pageSize,
        }),
        db.select({ count: count() }).from(schema.books),
      ]);

      return {
        status: 200,
        body: BooksResponseSchema.parse({
          data,
          meta: { page, pageSize, total: total[0]?.count },
        }),
      };
    }
  },
});
