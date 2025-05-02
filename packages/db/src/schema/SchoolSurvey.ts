import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// TABLE
export const SchoolSurvey = pgTable("school_survey", {
  id: uuid("id").defaultRandom().primaryKey(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

  // CONTACT
  contactMode: varchar("contact_mode", { length: 255 }).notNull(),
  contactValue: varchar("contact_value", { length: 255 }).notNull(),

  // SCHOOL IDENTITY
  schoolName: varchar("school_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  enrollment: varchar("enrollment", { length: 50 }).notNull(), // e.g., "100–300"

  // RECORD SYSTEMS (multi-select + optional other)
  recordSystem: jsonb("record_system").notNull(), // array of values
  recordSystemOther: varchar("record_system_other", { length: 255 }),

  recordTypes: jsonb("record_types").notNull(),
  recordTypesOther: varchar("record_types_other", { length: 255 }),

  // CHALLENGES
  challenges: jsonb("challenges").notNull(),
  challengesOther: varchar("challenges_other", { length: 255 }),

  frequency: varchar("frequency", { length: 255 }).notNull(),

  // INTEREST IN IMPROVEMENTS
  openToDigital: varchar("open_to_digital", { length: 10 }), // yes | maybe | no
  helpfulFeatures: jsonb("helpful_features").notNull(),
  helpfulFeaturesOther: varchar("helpful_features_other", { length: 255 }),

  // Metadata
  submittedBy: varchar("submitted_by", { length: 255 }), // optional admin
});
