export type CurrencyCode = "GYD" | "USD" | "JMD";

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
 * Detects currency from timezone (useful for localhost/development)
 */
export function detectCurrencyFromTimezone(): CurrencyCode {
	if (typeof Intl === "undefined") return "USD";

	try {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		// Check for Jamaica timezone
		if (
			timezone.includes("Jamaica") ||
			timezone === "America/Jamaica" ||
			timezone.includes("Kingston")
		) {
			return "JMD";
		}

		// Check for Guyana timezone
		if (
			timezone.includes("Guyana") ||
			timezone === "America/Guyana" ||
			timezone.includes("Georgetown")
		) {
			return "GYD";
		}

		// Check for US timezone
		if (
			timezone.startsWith("America/") &&
			!timezone.includes("Jamaica") &&
			!timezone.includes("Guyana")
		) {
			// Could be US, default to USD
			return "USD";
		}
	} catch {
		// Fallback on error
	}

	return "USD";
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
