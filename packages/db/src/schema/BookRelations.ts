import { relations } from "drizzle-orm";

import { Book } from "./Book";
import { Knowledge } from "./Knowledge";

export const BookRelations = relations(Book, ({ many }) => ({
  knowledges: many(Knowledge),
}));
