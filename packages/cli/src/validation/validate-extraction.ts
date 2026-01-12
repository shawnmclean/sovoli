import { leadExtractionDocumentSchema } from "./schemas/lead-extraction-schema.js";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate extracted JSON structure against Zod schema
 */
export function validateExtraction(data: unknown): ValidationResult {
  const result = leadExtractionDocumentSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((err) => {
      const path = err.path.length > 0 ? err.path.join(".") : "root";
      return `${path}: ${err.message}`;
    });

    return {
      valid: false,
      error: `Validation failed:\n${errors.join("\n")}`,
    };
  }

  return { valid: true };
}
