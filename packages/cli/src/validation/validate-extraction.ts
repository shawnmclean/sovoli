import Ajv from "ajv";
import addFormats from "ajv-formats";
import { leadExtractionSchema } from "./schemas/lead-extraction-schema.js";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile(leadExtractionSchema);

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate extracted JSON structure against JSON Schema
 */
export function validateExtraction(data: unknown): ValidationResult {
  const valid = validate(data);

  if (!valid) {
    const errors = validate.errors?.map((err) => {
      const path = err.instancePath || err.schemaPath;
      return `${path}: ${err.message}`;
    }) || ["Unknown validation error"];

    return {
      valid: false,
      error: `Validation failed:\n${errors.join("\n")}`,
    };
  }

  return { valid: true };
}
