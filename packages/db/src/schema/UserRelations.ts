import { relations } from "drizzle-orm";

import { Collection } from "./Collection";
import { KnowledgeResource } from "./KnowledgeResource";
import { myBooks } from "./myBooks";
import { User } from "./User";

export const UserRelations = relations(User, ({ many }) => ({
  KnowledgeResources: many(KnowledgeResource),
  Collections: many(Collection),
  myBooks: many(myBooks),
}));
