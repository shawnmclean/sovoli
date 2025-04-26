import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const contactModeEnum = pgEnum("contact_mode", [
  "whatsapp",
  "email",
  "phone",
]);

export const WaitlistContacts = pgTable("waitlist_contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

  mode: contactModeEnum("mode").notNull(), // whatsapp | email | phone
  contactValue: varchar("contact_value", { length: 255 }).notNull(),

  submittedBy: varchar("submitted_by", { length: 255 }), // optional (admin name if captured)
});
