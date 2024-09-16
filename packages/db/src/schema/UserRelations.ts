import { relations } from "drizzle-orm";

import { KnowledgeResource } from "./KnowledgeResource";
import { myBooks } from "./myBooks";
import { User } from "./User";

export const UserRelations = relations(User, ({ many }) => ({
  KnowledgeResources: many(KnowledgeResource),
  myBooks: many(myBooks),
}));
