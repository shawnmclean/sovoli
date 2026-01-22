import { parseISO } from "date-fns";
import type React from "react";
import type { PricingPackage } from "~/modules/core/economics/types";
import type { CurrencyCode } from "~/utils/currencyDetection";

interface ProgramPriceCardProps {
  pricingPackage: PricingPackage;
  pricingItemId: string;
  size?: "sm" | "md" | "lg";
  showHeader?: boolean;
  preferredCurrency?: CurrencyCode;
}

const formatCycle = (cycle: string) => {
  if (cycle === "annual") return "/ year";
  if (cycle === "term") return "/ term";
  return `/${cycle}`;
};

const daysUntil = (dateString?: string) => {
  if (!dateString) return "";
  const ms = parseISO(dateString).getTime() - Date.now();
  const days = Math.ceil(ms / 86400000);
  return days <= 0 ? "Expired" : days === 1 ? "1 day" : `${days} days`;
};

export const ProgramPriceCard: React.FC<ProgramPriceCardProps> = ({
  pricingPackage,
  pricingItemId,
  preferredCurrency,
}) => {
  const item = pricingPackage.pricingItems.find(
    (i) => i.id === pricingItemId || i.purpose === pricingItemId,
  );
  if (!item) return null;

  // Determine which currency to use
  // First, try preferred currency if provided and available
  let currency: CurrencyCode = "GYD";
  let original = 0;

  if (
    preferredCurrency &&
    item.amount[preferredCurrency] !== undefined &&
    item.amount[preferredCurrency] > 0
  ) {
    currency = preferredCurrency;
    original = item.amount[preferredCurrency] ?? 0;
  } else {
    // Find the first available currency with a value > 0 (same logic as PriceButton)
    const currencyEntry = Object.entries(item.amount).find(
      ([_, amount]) => amount && amount > 0,
    );

    if (currencyEntry) {
      currency = currencyEntry[0] as CurrencyCode;
      original = currencyEntry[1];
    } else {
      // Fallback to GYD if available, otherwise 0
      original = item.amount.GYD ?? 0;
    }
  }

  const now = new Date().toISOString();
  const discount = pricingPackage.discounts?.find(
    (d) =>
      d.type === "percentage" &&
      d.appliesTo.includes(item.id) &&
      (!d.validFrom || d.validFrom <= now) &&
      (!d.validUntil || d.validUntil >= now),
  );
  const discounted = discount
    ? original * (1 - discount.value / 100)
    : original;
  const saved = original - discounted;
  const showDiscount = discount && saved > 0;
  const isFree = discount?.value === 100;

  return (
    <div>
      {showDiscount ? (
        <div className="relative bg-content2 rounded-lg p-3 pt-6">
          <span className="absolute -top-2 left-3 bg-content2 border border-foreground-200 px-3 py-0.5 rounded-full text-xs text-foreground-700 font-medium shadow-sm uppercase">
            {item.label}
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-success">
                {isFree ? (
                  <span className="bg-success/10 text-success px-2 py-1 rounded-full">
                    FREE
                  </span>
                ) : (
                  `${currency} ${discounted.toLocaleString()}`
                )}
              </span>
              {isFree ? (
                <span className="text-xs font-semibold text-success">
                  Save {currency} {original.toLocaleString()}
                </span>
              ) : (
                <span className="text-xs font-semibold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  {discount.value}% OFF
                </span>
              )}
            </div>
            {discount.validUntil && (
              <span className="text-sm text-danger font-bold ml-auto">
                Ends in {daysUntil(discount.validUntil)}
              </span>
            )}
          </div>
          {!isFree && (
            <div className="flex items-center justify-between gap-2 mt-2">
              <span className="text-sm text-foreground-500 line-through">
                {currency} {original.toLocaleString()}
              </span>
            </div>
          )}
          {item.notes && (
            <p className="text-sm text-foreground-600 mt-2">{item.notes}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">
              {currency} {original.toLocaleString()}
            </p>
            {item.billingCycle !== "one-time" && (
              <p className="text-sm text-foreground-500">
                {formatCycle(item.billingCycle)}
              </p>
            )}
          </div>
          {item.billingCycle === "term" && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-foreground-600">
                {currency} {Math.round(original / 4).toLocaleString()} per month
              </p>
              <p className="text-xs text-foreground-400 italic">
                Flexible payment options & family discounts available
              </p>
            </div>
          )}
          {item.notes && (
            <p className="text-sm text-foreground-600 mt-2">{item.notes}</p>
          )}
        </div>
      )}
    </div>
  );
};
