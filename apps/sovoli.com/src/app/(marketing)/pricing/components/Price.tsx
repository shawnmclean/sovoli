import type { CurrencyCode } from "~/utils/currencyDetection";
import type { AmountByCurrency } from "~/modules/core/economics/types";

export interface PriceProps {
	usdPrice?: number;
	gydPrice?: number;
	jmdPrice?: number;
	// Allow passing AmountByCurrency directly for flexibility
	amount?: AmountByCurrency;
	className?: string;
	preferredCurrency?: CurrencyCode;
}

export function Price({
	usdPrice,
	gydPrice,
	jmdPrice,
	amount,
	className = "",
	preferredCurrency = "USD",
}: PriceProps) {
	// Build currencies array from either individual props or amount object
	const currencies: {
		code: CurrencyCode;
		price: number;
	}[] = [];

	// If amount object is provided, use it (more flexible)
	if (amount) {
		if (amount.GYD !== undefined)
			currencies.push({ code: "GYD", price: amount.GYD });
		if (amount.JMD !== undefined)
			currencies.push({ code: "JMD", price: amount.JMD });
		if (amount.USD !== undefined)
			currencies.push({ code: "USD", price: amount.USD });
	} else {
		// Fall back to individual props
		if (gydPrice !== undefined)
			currencies.push({ code: "GYD", price: gydPrice });
		if (jmdPrice !== undefined)
			currencies.push({ code: "JMD", price: jmdPrice });
		if (usdPrice !== undefined)
			currencies.push({ code: "USD", price: usdPrice });
	}

	if (currencies.length === 0) return null;

	// Find the preferred currency, or fall back to USD, or first available
	let selectedCurrency = currencies.find((c) => c.code === preferredCurrency);

	// Try USD as fallback
	selectedCurrency ??= currencies.find((c) => c.code === "USD");

	// If still not found, use first available
	selectedCurrency ??= currencies[0];

	if (!selectedCurrency) return null;

	// Show only the selected currency
	return (
		<span className={className}>
			{selectedCurrency.price.toLocaleString("en-US", {
				style: "currency",
				currency: selectedCurrency.code,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			})}
		</span>
	);
}
