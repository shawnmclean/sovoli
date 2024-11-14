import { relations } from "drizzle-orm";

import { Import } from "./Import";
import { Knowledge } from "./Knowledge";
import { User } from "./User";

export const UserRelations = relations(User, ({ many }) => ({
  KnowledgeResources: many(Knowledge),
  Imports: many(Import),
}));
