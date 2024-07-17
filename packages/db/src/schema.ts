import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).notNull().unique(),
});
