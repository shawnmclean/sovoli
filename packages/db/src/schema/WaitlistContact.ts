import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const WaitlistContact = pgTable("waitlist_contact", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

  contactMode: varchar("contact_mode", { length: 255 }).notNull(),
  contactValue: varchar("contact_value", { length: 255 }).notNull(),

  submittedBy: varchar("submitted_by", { length: 255 }), // optional (admin name if captured)
});
