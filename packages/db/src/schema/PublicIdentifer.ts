// import { sql } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { Organization } from "./Organization";
import { User } from "./User";

export const publicIdentifier = pgTable(
  "public_identifier",
  {
    identifier: varchar("identifier", { length: 50 }).primaryKey(),
    organizationId: varchar("organization_id", { length: 256 }).references(
      () => Organization.id,
      {
        onDelete: "cascade",
      },
    ),
    userId: varchar("user_id", { length: 256 }).references(() => User.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  // (table) => [
  //   check(
  //     "one_target_only",
  //     sql.raw(
  //       `((${table.organizationId.name} IS NOT NULL)::int + (${table.userId.name} IS NOT NULL)::int) = 1`,
  //     ),
  //   ),
  // ],
);
