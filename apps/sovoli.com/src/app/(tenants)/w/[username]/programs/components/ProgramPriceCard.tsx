import React from "react";
import type { PricingPackage } from "~/modules/core/economics/types";
import { Chip } from "@sovoli/ui/components/chip";

interface ProgramPriceCardProps {
  pricingPackage: PricingPackage;
  pricingItemId: string;
  size?: "sm" | "md" | "lg";
  showHeader?: boolean;
}

const daysUntil = (dateString: string): string => {
  if (!dateString) return "";

  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Expired";
  if (diffDays === 1) return "1 day";
  return `${diffDays} days`;
};

const formatBillingCycle = (billingCycle: string): string => {
  switch (billingCycle) {
    case "one-time":
      return "One-time payment";
    case "annual":
      return "/ year";
    case "term":
      return "/ term";
    default:
      return billingCycle;
  }
};

export const ProgramPriceCard: React.FC<ProgramPriceCardProps> = ({
  pricingPackage,
  pricingItemId,
  size = "lg",
  showHeader = true,
}) => {
  const item = pricingPackage.pricingItems.find(
    (i) => i.id === pricingItemId || i.purpose === pricingItemId,
  );
  if (!item) return null;

  const now = new Date().toISOString();
  const discount = pricingPackage.discounts?.find(
    (d) =>
      d.type === "percentage" &&
      d.appliesTo.includes(item.id) &&
      (!d.validFrom || d.validFrom <= now) &&
      (!d.validUntil || d.validUntil >= now),
  );

  const getDiscounted = (currency: "GYD" | "USD") => {
    const base = item.amount[currency] ?? 0;
    if (discount) {
      return base * (1 - discount.value / 100);
    }
    return base;
  };

  const gydOriginal = item.amount.GYD;
  const usdOriginal = item.amount.USD;
  const gydDiscounted = getDiscounted("GYD");
  const usdDiscounted = getDiscounted("USD");

  const hasDiscount =
    (gydOriginal && gydDiscounted < gydOriginal) ??
    (usdOriginal && usdDiscounted < usdOriginal);

  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-${size} font-semibold`}>{item.label}</h2>
          {discount?.message && (
            <p className="text-xs text-foreground-400">({discount.message})</p>
          )}
        </div>
      )}
      {hasDiscount ? (
        <>
          {/* Savings and urgency message */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-success font-semibold text-base">
              Save GYD {((gydOriginal ?? 0) - gydDiscounted).toLocaleString()}
            </span>
            {discount?.validUntil && (
              <span className="text-danger font-medium text-base">
                – Ends in {daysUntil(discount.validUntil)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between bg-content2 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-success">
                  GYD {gydDiscounted.toLocaleString()}
                </p>
                {item.billingCycle !== "one-time" && (
                  <p className="text-xs text-foreground-400">
                    {formatBillingCycle(item.billingCycle)}
                  </p>
                )}
              </div>
              <p className="text-sm text-foreground-500 line-through">
                GYD {gydOriginal?.toLocaleString()}
              </p>
            </div>
            <Chip color="success" variant="flat">
              {discount?.value}% OFF
            </Chip>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold text-primary">
            GYD {gydOriginal?.toLocaleString()}
          </p>
          {item.billingCycle !== "one-time" && (
            <p className="text-xs text-foreground-400">
              {formatBillingCycle(item.billingCycle)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
