import { db, eq, schema } from "@sovoli/db";

import { UserNotFoundError } from "../errors";

export interface PutMyBooksOptions {
  username: string;
  books: {
    title?: string;
    author?: string;
    isbn?: string;
    shelfId?: number;
  }[];
}

export async function putMyBooks(options: PutMyBooksOptions) {
  const user = await db.query.users.findFirst({
    with: {
      myBooks: {
        with: {
          book: true,
        },
      },
    },
    where: eq(schema.users.username, options.username),
  });
  if (!user) throw new UserNotFoundError(options.username);

  return user.myBooks;
}
