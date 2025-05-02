import { z } from "zod";

// Coerce string or array into array form
const asArray = () =>
  z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]));

export const formInsertSchoolSurveySchema = z.object({
  // Contact Info
  contactMode: z.string().min(1).max(255),
  contactValue: z.string().min(3).max(255),

  // School Identity
  schoolName: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
  enrollment: z.string().min(1, "Please select an enrollment range").max(50),

  // Record-Keeping
  recordSystem: asArray().refine((arr) => arr.length > 0, {
    message: "Please select at least one record system",
  }),
  recordSystemOther: z.string().max(255).optional().nullable(),

  recordTypes: asArray().refine((arr) => arr.length > 0, {
    message: "Please select at least one record type",
  }),
  recordTypesOther: z.string().max(255).optional().nullable(),

  // Challenges
  challenges: asArray().refine((arr) => arr.length > 0, {
    message: "Please select at least one challenge",
  }),
  challengesOther: z.string().max(255).optional().nullable(),

  frequency: z.string().min(1, "Please select a frequency").max(50),

  // Improvements
  openToDigital: z.string().max(10).optional(),
  helpfulFeatures: asArray().refine((arr) => arr.length > 0, {
    message: "Please select at least one helpful feature",
  }),
  helpfulFeaturesOther: z.string().max(255).optional().nullable(),

  // Metadata
  submittedBy: z.string().max(255).optional(),
});

export type FormInsertSchoolSurvey = z.infer<
  typeof formInsertSchoolSurveySchema
>;
