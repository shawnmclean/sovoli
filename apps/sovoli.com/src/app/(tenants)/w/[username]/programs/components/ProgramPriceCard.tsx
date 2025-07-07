import React from "react";
import type { PricingPackage } from "~/modules/core/economics/types";
import { Chip } from "@sovoli/ui/components/chip";

interface ProgramPriceCardProps {
  pricingPackage: PricingPackage;
  pricingItemId: string;
}

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
      <h2 className="text-lg font-semibold mb-2">{item.label}</h2>
      {hasDiscount ? (
        <>
          <div className="flex items-center justify-between bg-content2 p-3 rounded-lg">
            <div>
              <p className="text-xl font-bold text-success">
                GYD {gydDiscounted.toLocaleString()}
              </p>
              <p className="text-sm text-foreground-500 line-through">
                GYD {gydOriginal?.toLocaleString()}
              </p>
            </div>
            <Chip color="success" variant="flat">
              {discount?.value}% OFF
            </Chip>
          </div>
          <p className="text-sm text-foreground-500 mt-2">
            Early Bird discount applied
          </p>
        </>
      ) : (
        <p className="text-3xl font-bold text-primary">
          GYD {gydOriginal?.toLocaleString()}
        </p>
      )}
    </div>
  );
};
