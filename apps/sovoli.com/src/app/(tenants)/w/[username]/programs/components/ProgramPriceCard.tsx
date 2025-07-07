import React from "react";
import type { PricingPackage } from "~/modules/core/economics/types";
import { tv } from "tailwind-variants";

interface ProgramPriceCardProps {
  pricingPackage: PricingPackage;
  pricingItemId: string;
  size?: "sm" | "md";
  variant?: "main" | "secondary";
}

const priceCard = tv({
  slots: {
    base: "relative rounded-xl bg-gray-900 border border-gray-700 flex flex-col overflow-visible",
    labelBadge:
      "absolute -top-4 left-4 z-10 px-3 py-1 rounded-full border font-semibold shadow text-xs flex items-center justify-center",
    discountRow: "flex items-center gap-2 mb-1 mt-1",
    discountBox:
      "flex items-center gap-2 px-3 py-1 rounded-lg border font-semibold",
    priceRow: "flex items-baseline gap-2",
    price: "font-bold",
    priceSub: "font-bold",
    lineThrough: "line-through",
  },
  variants: {
    size: {
      sm: {
        base: "p-1 text-xs gap-0.5 min-w-[160px]",
        labelBadge:
          "text-xs px-2 py-0.5 border-gray-200 bg-white text-gray-700",
        discountBox:
          "text-xs border-success-200 bg-success-50 text-success-700",
        price: "text-lg text-green-700",
        priceSub: "text-base text-green-700",
        lineThrough: "text-base text-gray-400",
      },
      md: {
        base: "p-4 text-base gap-2 min-w-[220px]",
        labelBadge: "text-sm px-3 py-1 border-gray-300 bg-white text-gray-700",
        discountBox:
          "text-sm border-success-200 bg-success-50 text-success-700",
        price: "text-2xl text-green-700",
        priceSub: "text-lg text-green-700",
        lineThrough: "text-lg text-gray-400",
      },
    },
    variant: {
      main: {
        labelBadge:
          "-top-4 left-4 text-base px-4 py-1 border-gray-300 bg-white text-gray-700 shadow font-bold",
        discountBox: "hidden",
      },
      secondary: {
        labelBadge:
          "-top-3 left-3 text-xs px-2 py-0.5 border-gray-200 bg-white text-gray-700 font-semibold",
        discountBox: "flex border-success-200 bg-success-50 text-success-700",
      },
    },
  },
  compoundVariants: [
    { size: "sm", variant: "main", class: "min-w-[180px]" },
    { size: "sm", variant: "secondary", class: "min-w-[160px]" },
    { size: "md", variant: "main", class: "min-w-[240px]" },
    { size: "md", variant: "secondary", class: "min-w-[200px]" },
  ],
  defaultVariants: {
    size: "md",
    variant: "main",
  },
});

export const ProgramPriceCard: React.FC<ProgramPriceCardProps> = ({
  pricingPackage,
  pricingItemId,
  size = "md",
  variant = "main",
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

  const {
    base,
    labelBadge,
    discountRow,
    discountBox,
    priceRow,
    price,
    priceSub,
    lineThrough,
  } = priceCard({ size, variant });

  return (
    <div className={base()}>
      {item.label && <span className={labelBadge()}>{item.label}</span>}
      <div className={size === "sm" ? "pt-2" : "pt-4"} />
      {hasDiscount && variant === "secondary" && (
        <div className={discountRow()}>
          <div className={discountBox()}>
            <span className="font-semibold">{discount?.value}% OFF</span>
            {discount?.message && (
              <span className="text-success-600 text-xs">
                • {discount.message}
              </span>
            )}
          </div>
        </div>
      )}
      {hasDiscount && variant === "main" && (
        <div className={discountRow()}>
          <span className="text-green-700 font-semibold text-base">
            {discount?.value}% OFF
          </span>
          {discount?.message && (
            <span className="text-green-700 text-xs">• {discount.message}</span>
          )}
        </div>
      )}
      <div className={priceRow()}>
        {usdOriginal && usdDiscounted < usdOriginal ? (
          <>
            <span className={price()}>${usdDiscounted.toLocaleString()}</span>
            <span className={priceSub()}>
              / GYD {gydDiscounted.toLocaleString()}
            </span>
          </>
        ) : gydOriginal && gydDiscounted < gydOriginal ? (
          <span className={price()}>GYD {gydDiscounted.toLocaleString()}</span>
        ) : usdOriginal ? (
          <span className={price()}>${usdOriginal.toLocaleString()}</span>
        ) : gydOriginal ? (
          <span className={price()}>GYD {gydOriginal.toLocaleString()}</span>
        ) : (
          <span className="text-gray-400">Contact for pricing</span>
        )}
      </div>
      {hasDiscount && (
        <div className={lineThrough()}>
          {usdOriginal && usdDiscounted < usdOriginal && (
            <span>${usdOriginal.toLocaleString()} / </span>
          )}
          {gydOriginal && gydDiscounted < gydOriginal && (
            <span>GYD {gydOriginal.toLocaleString()}</span>
          )}
        </div>
      )}
    </div>
  );
};
