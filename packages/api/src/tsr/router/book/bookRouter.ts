
import { tsr } from "@ts-rest/serverless/next";

import { bookContract } from "./bookContract";
import { BooksResponseSchema } from "../../../schema";
import { searchBooksByQuery } from "../../../service/books";
import { count, db, schema } from "@sovoli/db";

export const bookRouter = tsr.router(bookContract, {
  listOrSearchBooks: async ({ query: { q, page, pageSize } }) => {
    if(q) {
      // search by query
      const books = await searchBooksByQuery({
        query: q,
        page: page,
        pageSize: pageSize,
      } );
      return {
        status: 200,
        body: BooksResponseSchema.parse(books),
      };
    }
    else {
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
});

