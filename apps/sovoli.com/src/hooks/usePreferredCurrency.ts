import { useMemo } from "react";
import type { CurrencyCode } from "~/utils/currencyDetection";
import { detectCurrencyFromTimezone } from "~/utils/currencyDetection";

/**
 * Hook that enhances server-detected currency with client-side timezone detection.
 * If the server returns USD (default), it tries to detect currency from the user's timezone.
 *
 * @param serverCurrency - The currency detected on the server (defaults to "USD")
 * @returns The preferred currency, enhanced with client-side detection if needed
 */
export function usePreferredCurrency(
  serverCurrency: CurrencyCode = "USD",
): CurrencyCode {
  return useMemo<CurrencyCode>(() => {
    // If server returned USD (default), try client-side detection
    if (serverCurrency === "USD") {
      const clientCurrency = detectCurrencyFromTimezone();
      return clientCurrency;
    }
    return serverCurrency;
  }, [serverCurrency]);
}
