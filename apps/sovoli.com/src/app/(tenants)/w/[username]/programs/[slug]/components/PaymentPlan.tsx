"use client";

import { Divider } from "@sovoli/ui/components/divider";
import { addDays, addMonths, addWeeks, addYears, parseISO } from "date-fns";
import type {
  PaymentSplit,
  PricingPackage,
} from "~/modules/core/economics/types";
import type { CurrencyCode } from "~/utils/currencyDetection";
import { formatDate } from "~/utils/dateUtils";

interface PaymentPlanProps {
  pricingPackage: PricingPackage;
  preferredCurrency?: CurrencyCode;
  cycleStartDate?: string; // ISO date string for calculating "after_start" dates
}

interface PaymentItem {
  label: string;
  amount: number;
  currency: CurrencyCode;
  dueDate?: string;
}

export function PaymentPlan({
  pricingPackage,
  preferredCurrency,
  cycleStartDate,
}: PaymentPlanProps) {
  // Get currency and amount for a pricing item
  const getItemCurrencyAndAmount = (itemId: string) => {
    const item = pricingPackage.pricingItems.find((i) => i.id === itemId);
    if (!item) return { currency: "GYD" as CurrencyCode, amount: 0 };

    let currency: CurrencyCode = "GYD";
    let amount = 0;

    if (
      preferredCurrency &&
      item.amount[preferredCurrency] !== undefined &&
      item.amount[preferredCurrency] > 0
    ) {
      currency = preferredCurrency;
      amount = item.amount[preferredCurrency] ?? 0;
    } else {
      const currencyEntry = Object.entries(item.amount).find(
        ([_, amt]) => amt && amt > 0,
      );
      if (currencyEntry) {
        currency = currencyEntry[0] as CurrencyCode;
        amount = currencyEntry[1];
      } else {
        amount = item.amount.GYD ?? 0;
      }
    }

    return { currency, amount };
  };

  // Format due date based on dueAt type
  const formatDueDate = (dueAt: PaymentSplit["dueAt"]) => {
    switch (dueAt.type) {
      case "now":
        return undefined; // No date shown for "now"
      case "date":
        return formatDate(dueAt.date);
      case "after_start": {
        if (!cycleStartDate) return undefined;
        const startDate = parseISO(cycleStartDate);
        const { unit, count } = dueAt;
        const calculatedDate =
          unit === "day"
            ? addDays(startDate, count)
            : unit === "week"
              ? addWeeks(startDate, count)
              : unit === "month"
                ? addMonths(startDate, count)
                : addYears(startDate, count);
        return formatDate(calculatedDate.toISOString());
      }
      default:
        return undefined;
    }
  };

  // Build payment plan structure
  const dueToProceed: PaymentItem[] = [];
  const dueLater: PaymentItem[] = [];
  let currency: CurrencyCode = "GYD";

  // Add registration fee to "Due to Proceed" if it exists
  const registrationItem = pricingPackage.pricingItems.find(
    (item) => item.purpose === "registration",
  );
  if (registrationItem) {
    const { currency: regCurrency, amount: regAmount } =
      getItemCurrencyAndAmount(registrationItem.id);
    currency = regCurrency;
    dueToProceed.push({
      label: registrationItem.label,
      amount: regAmount,
      currency: regCurrency,
    });
  }

  // Process payment splits
  if (pricingPackage.paymentSplits && pricingPackage.paymentSplits.length > 0) {
    for (const split of pricingPackage.paymentSplits) {
      const { currency: splitCurrency, amount: totalAmount } =
        getItemCurrencyAndAmount(split.pricingItemId);
      currency = splitCurrency;

      const splitAmount = Math.round((totalAmount * split.percentage) / 100);
      const dueDate = formatDueDate(split.dueAt);
      const item = pricingPackage.pricingItems.find(
        (i) => i.id === split.pricingItemId,
      );

      if (!item) continue;

      const paymentItem: PaymentItem = {
        label:
          split.dueAt.type === "now"
            ? `${item.label} (${split.percentage}%)`
            : `Remaining ${item.label} (${split.percentage}%)`,
        amount: splitAmount,
        currency: splitCurrency,
        dueDate,
      };

      if (split.dueAt.type === "now") {
        dueToProceed.push(paymentItem);
      } else {
        dueLater.push(paymentItem);
      }
    }
  }

  // Calculate totals
  const totalDueToProceed = dueToProceed.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  // Generate summary text based on payment splits (not including registration)
  const summaryParts: string[] = [];
  const tuitionSplits =
    pricingPackage.paymentSplits?.filter(
      (split) => split.pricingItemId === "tuition",
    ) ?? [];

  if (tuitionSplits.length > 0) {
    const nowSplit = tuitionSplits.find((s) => s.dueAt.type === "now");
    const laterSplit = tuitionSplits.find((s) => s.dueAt.type !== "now");

    if (nowSplit && laterSplit) {
      summaryParts.push(`${nowSplit.percentage}% due to proceed`);
      const laterDueDate = formatDueDate(laterSplit.dueAt);
      if (laterDueDate) {
        summaryParts.push(`${laterSplit.percentage}% due by ${laterDueDate}`);
      }
    }
  }

  if (dueToProceed.length === 0 && dueLater.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wide">
        Payment Plan
      </h3>

      {/* Summary */}
      {summaryParts.length > 0 && (
        <p className="text-sm text-foreground-600">{summaryParts.join(", ")}</p>
      )}

      {/* Due to Proceed Section */}
      {dueToProceed.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Due to Proceed
          </h4>
          <div className="space-y-2">
            {dueToProceed.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-sm text-foreground-600">{item.label}</p>
                <p className="text-sm font-medium text-foreground">
                  {item.currency} {item.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              Total Due to Proceed
            </p>
            <p className="text-sm font-semibold text-foreground">
              {currency} {totalDueToProceed.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Due Later Section */}
      {dueLater.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Due Later</h4>
          <div className="space-y-2">
            {dueLater.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground-600">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">
                    {item.currency} {item.amount.toLocaleString()}
                  </p>
                </div>
                {item.dueDate && (
                  <p className="text-xs text-foreground-500">
                    Due by {item.dueDate}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
