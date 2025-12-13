import { z } from "zod";
import type { Org, OrgLocation, OrgVerification, OrgTechStack } from "~/modules/organisations/types";
import type { Contact, SocialLink } from "~/modules/core/types";
import type { Media } from "~/modules/core/media/types";

/**
 * Zod schema for Contact
 */
const contactJsonSchema = z.object({
  type: z.enum(["email", "phone", "whatsapp", "other"]),
  label: z.string().optional(),
  value: z.string(),
  isPublic: z.boolean(),
  primary: z.boolean().optional(),
});

/**
 * Zod schema for Address
 */
const addressJsonSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  line3: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  countryCode: z.string(),
  landmark: z.string().optional(),
});

/**
 * Zod schema for OrgLocation
 */
const orgLocationJsonSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  isPrimary: z.boolean().optional(),
  address: addressJsonSchema,
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  placeId: z.string().optional(),
  contacts: z.array(contactJsonSchema),
  features: z.array(z.string()).optional(),
});

/**
 * Zod schema for Jurisdiction
 */
const jurisdictionJsonSchema = z.object({
  country: z.string(),
  stateOrProvince: z.string().optional(),
  cityOrRegion: z.string().optional(),
});

/**
 * Zod schema for OrgVerificationDocument
 */
const orgVerificationDocumentJsonSchema = z.object({
  type: z.enum([
    "business_registration",
    "tax_id",
    "operating_license",
    "other",
  ]),
  name: z.string(),
  url: z.string().optional(),
  uploadedAt: z.string(),
  issuedDate: z.string().optional(),
  referenceNumber: z.string().optional(),
  issuingAuthority: z.string().optional(),
  issuingJurisdiction: jurisdictionJsonSchema.optional(),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Zod schema for OrgVerification
 */
const orgVerificationJsonSchema = z.object({
  status: z.enum(["pending", "verified", "rejected"]),
  submittedAt: z.string(),
  verifiedAt: z.string().optional(),
  rejectedReason: z.string().optional(),
  submittedBy: z.string(),
  documents: z.array(orgVerificationDocumentJsonSchema),
  incorporationDate: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Zod schema for Person
 */
const personJsonSchema = z.object({
  name: z.string(),
  contacts: z.array(contactJsonSchema),
  notes: z.string().optional(),
});

/**
 * Zod schema for SocialLink
 */
const socialLinkJsonSchema = z.object({
  platform: z.enum([
    "facebook",
    "instagram",
    "youtube",
    "x",
    "website",
    "other",
  ]),
  label: z.string().optional(),
  url: z.string(),
});

/**
 * Zod schema for Media
 */
const mediaJsonSchema = z.object({
  type: z
    .enum([
      "image",
      "video",
      "pdf",
      "document",
      "spreadsheet",
      "presentation",
      "audio",
    ])
    .default("image"),
  url: z.string(),
  publicId: z.string(),
  assetId: z.string().optional(),
  bucket: z.string().optional(),
  uploadedAt: z.string().optional(),
  bytes: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  version: z.number().optional(),
  caption: z.string().optional(),
  alt: z.string().optional(),
  category: z
    .enum([
      "environment",
      "classroom",
      "activities",
      "events",
      "awards",
      "default",
    ])
    .optional(),
  duration: z.number().optional(),
  videoCodec: z.string().optional(),
  audioCodec: z.string().optional(),
  fps: z.number().optional(),
  bitrate: z.number().optional(),
  posterUrl: z.string().optional(),
  pages: z.number().optional(),
  audioDuration: z.number().optional(),
  audioBitrate: z.number().optional(),
});

/**
 * Zod schema for PlatformInfo
 */
const platformInfoJsonSchema = z.object({
  name: z.string(),
  vendor: z.string().optional(),
  url: z.string().optional(),
  type: z.enum(["manual", "integrated", "external"]).optional(),
  notes: z.string().optional(),
});

/**
 * Zod schema for EnrollmentPlatform
 */
const enrollmentPlatformJsonSchema = platformInfoJsonSchema.extend({
  method: z.enum(["manual", "whatsapp", "external-form", "integrated"]),
  formUrl: z.string().optional(),
});

/**
 * Zod schema for OrgTechStack
 */
const orgTechStackJsonSchema = z
  .object({
    website: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    sis: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    lms: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    parentPortal: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    billing: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    messaging: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    hr: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    security: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    transport: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    library: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    analytics: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    compliance: z.union([platformInfoJsonSchema, z.array(platformInfoJsonSchema)]).optional(),
    enrollment: enrollmentPlatformJsonSchema.optional(),
    notes: z.string().optional(),
  })
  .passthrough(); // Allow additional fields for future extensibility

/**
 * Zod schema for Org (core organization data)
 */
const orgJsonSchema = z.object({
  username: z.string(),
  name: z.string(),
  logoPhoto: mediaJsonSchema.optional(),
  categories: z.array(z.string()),
  locations: z.array(orgLocationJsonSchema),
  socialLinks: z.array(socialLinkJsonSchema).optional(),
  verification: orgVerificationJsonSchema.optional(),
  isVerified: z.boolean().optional(),
  internalCRM: z
    .object({
      people: z.array(personJsonSchema),
      claimStatus: z.enum(["unclaimed", "pending", "claimed"]).optional(),
      claimedAt: z.string().optional(),
      claimedBy: z.string().optional(),
    })
    .optional(),
  techStack: orgTechStackJsonSchema.optional(),
  media: z.array(mediaJsonSchema).optional(),
});

/**
 * Zod schema for org.json file structure
 */
const orgModuleJsonSchema = orgJsonSchema;

/**
 * Parses an org.json file and returns a fully hydrated Org object.
 *
 * @param jsonData - The parsed JSON data from the org.json file
 * @returns Fully hydrated Org object
 * @throws Error if JSON structure is invalid
 */
export function parseOrgModule(jsonData: unknown): Org {
  const validated = orgModuleJsonSchema.parse(jsonData);

  // Convert JSON data to Org type, handling type conversions
  const org: Org = {
    username: validated.username,
    name: validated.name,
    logoPhoto: validated.logoPhoto as Media | undefined,
    categories: validated.categories as Org["categories"],
    locations: validated.locations as OrgLocation[],
    socialLinks: validated.socialLinks as SocialLink[] | undefined,
    verification: validated.verification as OrgVerification | undefined,
    isVerified: validated.isVerified,
    internalCRM: validated.internalCRM,
    techStack: validated.techStack as OrgTechStack | undefined,
    media: validated.media as Media[] | undefined,
  };

  return org;
}
