import React from "react";
import type { PricingPackage } from "~/modules/core/economics/types";
import { parseISO } from "date-fns";

interface ProgramPriceCardProps {
  pricingPackage: PricingPackage;
  pricingItemId: string;
  size?: "sm" | "md" | "lg";
  showHeader?: boolean;
}

const formatCycle = (cycle: string) => {
  if (cycle === "one-time") return "";
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

  const original = item.amount.GYD ?? 0;
  const discounted = discount
    ? original * (1 - discount.value / 100)
    : original;
  const saved = original - discounted;
  const showDiscount = discount && saved > 0;
  const isFree = discount && discount.value === 100;

  return (
    <div>
      {showDiscount ? (
        <div className="relative bg-content2 rounded-lg p-3 space-y-1">
          <span className="absolute -top-2 left-3 bg-content2 border border-foreground-200 px-3 py-0.5 rounded-full text-xs text-foreground-700 font-medium shadow uppercase">
            {item.label}
          </span>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-success">
                {isFree ? "FREE" : `GYD ${discounted.toLocaleString()}`}
              </span>
              <span className="text-xs font-semibold bg-success/10 text-success px-2 py-0.5 rounded-full">
                {isFree
                  ? `Save ${original.toLocaleString()}`
                  : `${discount.value}% OFF`}
              </span>
            </div>
            {discount.validUntil && (
              <span className="text-sm text-danger font-bold">
                Ends in {daysUntil(discount.validUntil)}
              </span>
            )}
          </div>
          {!isFree && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-foreground-500 line-through">
                GYD {original.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold text-primary">
            GYD {original.toLocaleString()}
          </p>
          {item.billingCycle !== "one-time" && (
            <p className="text-xs text-foreground-400">
              {formatCycle(item.billingCycle)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
