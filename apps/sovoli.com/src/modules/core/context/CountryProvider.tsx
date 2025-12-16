"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { detectCountryFromTimezone } from "~/utils/currencyDetection";

interface CountryContextValue {
	countryCode: string | null;
}

const CountryContext = createContext<CountryContextValue | null>(null);

interface CountryProviderProps {
	children: ReactNode;
	countryCode?: string | null;
}

export function CountryProvider({
	children,
	countryCode = null,
}: CountryProviderProps) {
	return (
		<CountryContext.Provider value={{ countryCode }}>
			{children}
		</CountryContext.Provider>
	);
}

/**
 * Hook to access the detected country code from context
 * Returns the ISO country code (e.g., "GY", "JM", "US", "GB") or null
 * 
 * If server-side detection returned null (e.g., in localhost), this hook
 * will attempt client-side detection using timezone as a fallback.
 */
export function useCountry(): string | null {
	const context = useContext(CountryContext);
	const serverCountryCode = context?.countryCode ?? null;

	return useMemo(() => {
		// If server provided a country code, use it
		if (serverCountryCode) {
			return serverCountryCode;
		}

		// Otherwise, try client-side detection (useful for localhost/development)
		return detectCountryFromTimezone();
	}, [serverCountryCode]);
}

