import {  sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Function to generate a random string
const randomUsername = () => `user_${Math.random().toString(36).substring(2, 10)}`;
export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).unique().default(sql`${randomUsername()}`),
});
