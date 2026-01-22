// Utility to sanitize phone numbers for matching and storage
// Removes all non-digit characters, strips leading zeros, and ensures country code is present

/**
 * Sanitizes a phone number string.
 *
 * - Removes all non-digit characters
 * - Removes leading zeros
 * - Ensures the number starts with the given country code
 *
 * @param input The phone number string to sanitize
 * @param defaultCountryCode The country code to prepend if missing (e.g., '1' for US, '592' for Guyana)
 * @returns The sanitized phone number string
 */
export function sanitizePhoneNumber(
  input: string,
  defaultCountryCode: string,
): string {
  if (!input) return "";
  // Remove all non-digit characters
  let digits = input.replace(/\D/g, "");
  // Remove leading zeros
  digits = digits.replace(/^0+/, "");
  // If the number does not start with the country code, prepend it
  if (!digits.startsWith(defaultCountryCode)) {
    digits = defaultCountryCode + digits;
  }
  return digits;
}
