import { z } from "zod";
import {
  leadExtractionDocumentSchema,
  type LeadExtractionDocument,
} from "./types";

/**
 * Validation result for lead extraction documents
 */
export interface ValidationResult {
  success: true;
  data: LeadExtractionDocument;
}

export interface ValidationError {
  success: false;
  error: z.ZodError;
  message: string;
}

export type ValidateResult = ValidationResult | ValidationError;

/**
 * Validates a lead extraction document against the schema
 *
 * @param data - The data to validate (can be unknown/any)
 * @returns ValidationResult with parsed data, or ValidationError with details
 */
export function validateLeadExtraction(
  data: unknown,
): ValidateResult {
  const result = leadExtractionDocumentSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Format error message for better readability
  const errorMessages = result.error.errors.map((err) => {
    const path = err.path.join(".");
    return `${path}: ${err.message}`;
  });

  return {
    success: false,
    error: result.error,
    message: `Validation failed:\n${errorMessages.join("\n")}`,
  };
}

/**
 * Validates and throws if invalid (for use in scripts)
 *
 * @param data - The data to validate
 * @returns Validated LeadExtractionDocument
 * @throws Error if validation fails
 */
export function validateLeadExtractionOrThrow(
  data: unknown,
): LeadExtractionDocument {
  const result = validateLeadExtraction(data);

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}

/**
 * Exports the schema for use in other modules
 */
export { leadExtractionDocumentSchema };
