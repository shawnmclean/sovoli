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
/**
 * Before this function is called, ensure the user has permission to update this user's books
 * @param options
 * @returns
 */
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

  // for each book in options, find the book in the database from the inference system.
  // the inference system will return the book/create it if it doesn't exist.
  // we will then link the book to the user by updating the myBooks table.

  return user.myBooks;
}
