import { relations } from "drizzle-orm";

import { Import } from "./Import";
import { User } from "./User";

export const ImportRelations = relations(Import, ({ one }) => ({
  User: one(User, {
    fields: [Import.userId],
    references: [User.id],
  }),
}));
