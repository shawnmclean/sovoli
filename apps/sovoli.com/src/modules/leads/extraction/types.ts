import { z } from "zod";

/**
 * Lead Extraction Types
 *
 * These types define the structure of extracted evidence from ad images.
 * The schema is designed to align with target types (Org, Program, Contact, SocialLink)
 * while preserving all raw extracted data for later transformation.
 */

// ============================================================================
// Artifact Metadata
// ============================================================================

export const ingestMethodSchema = z.enum([
  "manual_upload",
  "file_read",
  "api_ingest",
]);

export const leadExtractionSourceSchema = z.object({
  ingest_method: ingestMethodSchema,
  platform_hint: z.string().nullable(),
  captured_at: z.string().nullable(), // ISO-8601
  locale_hint: z.string().nullable(), // "en-JM", "en-US", etc.
});

export const leadExtractionFileSchema = z.object({
  filename: z.string().nullable(),
  hash: z.string().nullable(),
});

export const leadExtractionArtifactSchema = z.object({
  id: z.string(),
  source: leadExtractionSourceSchema,
  file: leadExtractionFileSchema,
});

// ============================================================================
// Organization Evidence
// ============================================================================

export const organizationNameSchema = z.object({
  id: z.string(),
  name: z.string(),
  confidence: z.enum(["high", "medium", "low"]).optional(),
});

// ============================================================================
// Program Evidence
// ============================================================================

export const pricingItemEvidenceSchema = z.object({
  amount: z.string(), // Raw amount string: "$2500", "65,000", etc.
  currency: z.string().optional(), // Inferred currency hint: "USD", "JMD", "GYD"
  label: z.string().optional(), // "Registration", "Tuition", "Deposit", etc.
  notes: z.string().optional(), // Additional context
});

export const tuitionPricingItemEvidenceSchema = pricingItemEvidenceSchema.extend({
  billingCycle: z.string().optional(), // "one-time", "term", "program", etc. if mentioned
});

export const programPricingSchema = z
  .object({
    registration: z.array(pricingItemEvidenceSchema).optional(),
    tuition: z.array(tuitionPricingItemEvidenceSchema).optional(),
    materials: z.array(pricingItemEvidenceSchema).optional(),
    paymentPlans: z.array(z.string()).optional(),
    other: z.array(z.string()).optional(),
  })
  .optional();

export const programScheduleSchema = z
  .object({
    days: z.array(z.string()).optional(), // "Monday", "Saturday", etc.
    times: z.array(z.string()).optional(), // "9:00AM - 1:00PM", etc.
    dates: z.array(z.string()).optional(), // "Start feb 2nd 2026", "6 weeks", etc.
    duration: z.string().optional(), // "6 weeks", "2 days", etc.
  })
  .optional();

export const programEvidenceSchema = z.object({
  id: z.string(),
  name: z.string(), // Maps to Program.name
  quickFacts: z.array(z.string()).optional(), // Maps to Program.quickFacts
  pricing: programPricingSchema,
  schedule: programScheduleSchema,
  location: z.string().nullable().optional(), // Raw location string
  callsToAction: z.array(z.string()).optional(),
});

// ============================================================================
// Contact Evidence
// ============================================================================

export const phoneEvidenceSchema = z.object({
  value: z.string(), // Raw phone number
  type: z.enum(["phone", "whatsapp"]).optional(), // Inferred from context
});

export const emailEvidenceSchema = z.object({
  value: z.string(), // Raw email
});

export const contactEvidenceSchema = z.object({
  phones: z.array(phoneEvidenceSchema),
  emails: z.array(emailEvidenceSchema),
});

// ============================================================================
// Social Link Evidence
// ============================================================================

export const socialLinkPlatformSchema = z.enum([
  "facebook",
  "instagram",
  "youtube",
  "x",
  "website",
  "other",
]);

export const socialLinkEvidenceSchema = z.object({
  platform: socialLinkPlatformSchema,
  handle: z.string().optional(), // "@username" or "username"
  url: z.string().optional(), // Full URL if extracted
  value: z.string(), // Raw extracted value (handle or URL)
});

// ============================================================================
// Extraction Root
// ============================================================================

export const leadExtractionSchema = z.object({
  organizationNames: z.array(organizationNameSchema),
  programs: z.array(programEvidenceSchema),
  contacts: contactEvidenceSchema,
  socialLinks: z.array(socialLinkEvidenceSchema),
  urls: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(), // Org-level location strings
  platformSignals: z.array(z.string()).optional(),
});

// ============================================================================
// Entity Candidates
// ============================================================================

export const entityCandidateTypeSchema = z.enum([
  "organization",
  "program",
  "phone",
  "email",
  "social_link",
  "website",
]);

export const entityCandidateSchema = z.object({
  id: z.string(),
  type: entityCandidateTypeSchema,
  ref: z.string(), // Reference to extraction id
  value: z.string().optional(), // Extracted value for direct matching
});

// ============================================================================
// Complete Extraction Document
// ============================================================================

export const leadExtractionDocumentSchema = z.object({
  artifact: leadExtractionArtifactSchema,
  extraction: leadExtractionSchema,
  entityCandidates: z.array(entityCandidateSchema),
});

// ============================================================================
// TypeScript Types (inferred from schemas)
// ============================================================================

export type IngestMethod = z.infer<typeof ingestMethodSchema>;
export type LeadExtractionSource = z.infer<typeof leadExtractionSourceSchema>;
export type LeadExtractionFile = z.infer<typeof leadExtractionFileSchema>;
export type LeadExtractionArtifact = z.infer<
  typeof leadExtractionArtifactSchema
>;
export type OrganizationName = z.infer<typeof organizationNameSchema>;
export type PricingItemEvidence = z.infer<typeof pricingItemEvidenceSchema>;
export type TuitionPricingItemEvidence = z.infer<
  typeof tuitionPricingItemEvidenceSchema
>;
export type ProgramPricing = z.infer<typeof programPricingSchema>;
export type ProgramSchedule = z.infer<typeof programScheduleSchema>;
export type ProgramEvidence = z.infer<typeof programEvidenceSchema>;
export type PhoneEvidence = z.infer<typeof phoneEvidenceSchema>;
export type EmailEvidence = z.infer<typeof emailEvidenceSchema>;
export type ContactEvidence = z.infer<typeof contactEvidenceSchema>;
export type SocialLinkPlatform = z.infer<typeof socialLinkPlatformSchema>;
export type SocialLinkEvidence = z.infer<typeof socialLinkEvidenceSchema>;
export type LeadExtraction = z.infer<typeof leadExtractionSchema>;
export type EntityCandidateType = z.infer<typeof entityCandidateTypeSchema>;
export type EntityCandidate = z.infer<typeof entityCandidateSchema>;
export type LeadExtractionDocument = z.infer<
  typeof leadExtractionDocumentSchema
>;
