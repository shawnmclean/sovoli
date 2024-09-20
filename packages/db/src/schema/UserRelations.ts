import { relations } from "drizzle-orm";

import { Knowledge } from "./Knowledge";
import { myBooks } from "./myBooks";
import { User } from "./User";

export const UserRelations = relations(User, ({ many }) => ({
  KnowledgeResources: many(Knowledge),
  myBooks: many(myBooks),
}));
