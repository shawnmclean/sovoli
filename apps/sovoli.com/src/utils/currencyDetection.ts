export type CurrencyCode = "GYD" | "USD" | "JMD";

/**
 * Phone country codes supported by phone number forms
 */
export type PhoneCountryCode = "US" | "GB" | "GY" | "JM";

/**
 * Maps country codes to their primary currency
 */
const countryToCurrency: Record<string, CurrencyCode> = {
  GY: "GYD", // Guyana
  JM: "JMD", // Jamaica
  US: "USD", // United States
  // Default to USD for most other countries
};

/**
 * Maps ISO country codes to phone country codes
 * Only includes countries supported by phone number forms
 */
const countryToPhoneCode: Record<string, PhoneCountryCode> = {
  US: "US",
  GB: "GB",
  GY: "GY",
  JM: "JM",
};

/**
 * Detects the user's country from Vercel geo headers or Cloudflare headers
 * Returns the country code (e.g., "GY", "JM", "US")
 */
export function detectCountryFromHeaders(
  headers: Headers | Record<string, string | null>,
): string | null {
  // Check if headers is a Headers object (has .get method)
  const isHeadersObject = headers instanceof Headers;

  // Vercel provides geo information via headers
  // Try Vercel's geo header first
  let vercelCountry: string | null = null;
  if (isHeadersObject) {
    vercelCountry = headers.get("x-vercel-ip-country");
  } else if ("x-vercel-ip-country" in headers) {
    vercelCountry = headers["x-vercel-ip-country"];
  }

  if (vercelCountry) {
    return vercelCountry;
  }

  // Try Cloudflare's country header
  let cfCountry: string | null = null;
  if (isHeadersObject) {
    cfCountry = headers.get("cf-ipcountry");
  } else if ("cf-ipcountry" in headers) {
    cfCountry = headers["cf-ipcountry"];
  }

  if (cfCountry) {
    return cfCountry;
  }

  // Try Next.js geo (if available)
  if (!isHeadersObject && "x-nextjs-geo" in headers) {
    const geo = headers["x-nextjs-geo"];
    if (geo && typeof geo === "string") {
      try {
        const geoData = JSON.parse(geo) as { country?: string };
        return geoData.country ?? null;
      } catch {
        // Ignore parse errors
      }
    }
  }

  // Try timezone from accept-language or other headers
  // This is a fallback for localhost/development
  if (isHeadersObject) {
    const acceptLanguage = headers.get("accept-language");
    if (acceptLanguage) {
      // Check if timezone info is in any header
      // For development, we'll use client-side detection instead
    }
  }

  return null;
}

/**
 * Detects country code from timezone (useful for localhost/development)
 * Returns ISO country code (e.g., "GY", "JM", "US") or null
 */
export function detectCountryFromTimezone(): string | null {
  if (typeof Intl === "undefined") return null;

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Check for Jamaica timezone
    if (
      timezone.includes("Jamaica") ||
      timezone === "America/Jamaica" ||
      timezone.includes("Kingston")
    ) {
      return "JM";
    }

    // Check for Guyana timezone
    if (
      timezone.includes("Guyana") ||
      timezone === "America/Guyana" ||
      timezone.includes("Georgetown")
    ) {
      return "GY";
    }

    // Check for US timezone
    if (
      timezone.startsWith("America/") &&
      !timezone.includes("Jamaica") &&
      !timezone.includes("Guyana")
    ) {
      // Could be US
      return "US";
    }

    // Check for UK timezone (Europe/London)
    if (
      timezone.includes("London") ||
      timezone === "Europe/London" ||
      timezone === "GMT"
    ) {
      return "GB";
    }
  } catch {
    // Fallback on error
  }

  return null;
}

/**
 * Detects currency from timezone (useful for localhost/development)
 */
export function detectCurrencyFromTimezone(): CurrencyCode {
  const country = detectCountryFromTimezone();
  if (!country) return "USD";
  return getPreferredCurrency(country);
}

/**
 * Gets the preferred currency based on country code
 * Falls back to USD if country is not recognized or not found
 */
export function getPreferredCurrency(countryCode: string | null): CurrencyCode {
  if (!countryCode) {
    return "USD"; // Default fallback
  }

  const upperCode = countryCode.toUpperCase();
  return countryToCurrency[upperCode] ?? "USD";
}

/**
 * Detects country and returns preferred currency
 */
export function detectCurrency(
  headers: Headers | Record<string, string | null>,
): CurrencyCode {
  const country = detectCountryFromHeaders(headers);
  return getPreferredCurrency(country);
}

/**
 * Converts an ISO country code to a phone country code
 * Returns "GY" as default if country is not recognized or null
 */
export function countryCodeToPhoneCode(
  countryCode: string | null,
): PhoneCountryCode {
  if (!countryCode) {
    return "GY"; // Default fallback
  }

  const upperCode = countryCode.toUpperCase();
  return countryToPhoneCode[upperCode] ?? "GY";
}
