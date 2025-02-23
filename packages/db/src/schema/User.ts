import type { AdapterAccountType } from "next-auth/adapters";
import type { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { createEnumObject } from "../utils";

const UserTypes = ["Bot", "Human"] as const;
export const UserType = createEnumObject(UserTypes);

export const userTypeEnum = pgEnum("user_type", UserTypes);
export const User = pgTable("user", {
  id: varchar("id", { length: 256 }).primaryKey().$defaultFn(createId),
  type: userTypeEnum("type").notNull().default(UserType.Human),

  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  mediaAssetId: varchar("media_asset_id", { length: 256 }),
  image: text("image"),
});

export const SelectUserSchema = createSelectSchema(User).partial();
export type SelectUserSchema = z.infer<typeof SelectUserSchema>;

export const Account = pgTable(
  "account",
  {
    userId: varchar("user_id", { length: 256 })
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),

    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const Session = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const VerificationToken = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);
