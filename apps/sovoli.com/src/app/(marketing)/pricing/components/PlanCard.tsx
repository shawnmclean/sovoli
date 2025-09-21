"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Button } from "@sovoli/ui/components/button";
import { CheckIcon, RocketIcon } from "lucide-react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { DualCurrencyPrice } from "./DualCurrencyPrice";
import type { PlanDefinition } from "~/modules/plans/types";
import { pluralize } from "~/utils/pluralize";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { PricingItem } from "~/modules/core/economics/types";

interface PlanCardProps {
  plan: PlanDefinition;
  showDetails: boolean;
  onToggleDetails?: () => void;
  isPrimary?: boolean;
  orgUsername?: string;
}

export function PlanCard({
  plan,
  showDetails,
  onToggleDetails,
  isPrimary = false,
  orgUsername,
}: PlanCardProps) {
  const [selectedOptionals, setSelectedOptionals] = useState<
    Record<string, boolean>
  >({});

  const toggleOptional = (id: string) => {
    setSelectedOptionals((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Split pricing items by billing cycle
  const baseItems = plan.pricingPackage.pricingItems.filter(
    (item) => !item.optional,
  );
  const optionalItems = plan.pricingPackage.pricingItems.filter(
    (item) => item.optional,
  );

  // Group base items by billing cycle
  const oneTimeItems = baseItems.filter(
    (item) => item.billingCycle === "one-time",
  );
  const annualItems = baseItems.filter(
    (item) => item.billingCycle === "annual",
  );

  // Apply active discounts
  const getDiscountedAmount = (
    item: PricingItem,
    currency: "USD" | "GYD",
  ): number => {
    const base = item.amount[currency] ?? 0;
    const now = new Date().toISOString();

    // Check for item-specific discounts first
    const activeDiscount = plan.pricingPackage.discounts?.find(
      (d) =>
        d.type === "percentage" &&
        d.appliesTo.includes(item.id) &&
        (!d.validFrom || d.validFrom <= now) &&
        (!d.validUntil || d.validUntil >= now),
    );

    if (activeDiscount) {
      return base * (1 - activeDiscount.value / 100);
    }

    return base;
  };

  // Compute totals by billing cycle
  const calculateTotal = (currency: "USD" | "GYD", items: PricingItem[]) => {
    return items.reduce(
      (sum, item) => sum + getDiscountedAmount(item, currency),
      0,
    );
  };

  const oneTimeUSD = calculateTotal("USD", oneTimeItems);
  const oneTimeGYD = calculateTotal("GYD", oneTimeItems);
  const annualUSD = calculateTotal("USD", annualItems);
  const annualGYD = calculateTotal("GYD", annualItems);

  const selectedAddOnCount =
    Object.values(selectedOptionals).filter(Boolean).length;
  const selectedAddOnLabels = optionalItems
    .filter((item) => selectedOptionals[item.id])
    .map((item) => item.label);

  const whatsappMessage =
    selectedAddOnLabels.length > 0
      ? `Hello, I'm interested in the ${plan.key} plan with these add-ons: ${selectedAddOnLabels.join(", ")}${orgUsername ? ` for ${orgUsername}` : ""}`
      : `Hello, I'm interested in the ${plan.key} plan${orgUsername ? ` for ${orgUsername}` : ""}`;

  return (
    <Card className="overflow-visible flex flex-col">
      <CardHeader className="flex flex-col items-start gap-2 pb-3">
        <div className="flex justify-between w-full items-center">
          <div>
            <h2 className="text-xl font-semibold">{plan.title}</h2>
            {plan.subtitle && (
              <p className="text-sm text-default-500">{plan.subtitle}</p>
            )}
          </div>
          {!isPrimary && onToggleDetails && (
            <button
              className="text-sm text-primary font-medium"
              onClick={onToggleDetails}
            >
              {showDetails ? "Hide" : "Show"} Details
            </button>
          )}
        </div>

        {/* Discount Badge */}
        {(() => {
          const now = new Date().toISOString();
          const setupDiscount = plan.pricingPackage.discounts?.find(
            (d) =>
              d.type === "percentage" &&
              d.appliesTo.includes("setup") &&
              (!d.validFrom || d.validFrom <= now) &&
              (!d.validUntil || d.validUntil >= now),
          );

          return setupDiscount ? (
            <div className="bg-success-50 border border-success-200 rounded-lg px-3 py-1">
              <div className="flex items-center gap-2">
                <span className="text-success-700 font-semibold text-sm">
                  {setupDiscount.value}% OFF
                </span>
                {setupDiscount.message && (
                  <span className="text-success-600 text-xs">
                    • {setupDiscount.message}
                  </span>
                )}
              </div>
            </div>
          ) : null;
        })()}

        {/* Main pricing - one-time fee */}
        <div className="text-xl font-medium mt-1">
          <span className="text-success-600">
            <DualCurrencyPrice usdPrice={oneTimeUSD} gydPrice={oneTimeGYD} />
          </span>
        </div>

        {/* Original pricing for discount comparison */}
        {(() => {
          const now = new Date().toISOString();
          const setupDiscount = plan.pricingPackage.discounts?.find(
            (d) =>
              d.type === "percentage" &&
              d.appliesTo.includes("setup") &&
              (!d.validFrom || d.validFrom <= now) &&
              (!d.validUntil || d.validUntil >= now),
          );

          if (!setupDiscount) return null;

          // Calculate original setup fee (without discount)
          const originalSetupUSD =
            plan.pricingPackage.pricingItems.find((item) => item.id === "setup")
              ?.amount.USD ?? 0;
          const originalSetupGYD =
            plan.pricingPackage.pricingItems.find((item) => item.id === "setup")
              ?.amount.GYD ?? 0;

          return (
            <div className="text-default-400 line-through text-sm mt-1">
              <DualCurrencyPrice
                usdPrice={originalSetupUSD}
                gydPrice={originalSetupGYD}
              />
            </div>
          );
        })()}

        {plan.onboardingNode && (
          <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning-500 rounded-full animate-bounce"></div>
              <p className="text-warning-700 text-sm font-medium">
                {plan.onboardingNode}
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      {showDetails && (
        <>
          <Divider />
          <CardBody className="py-4 flex-grow">
            {plan.description && (
              <p className="mb-4 text-sm">{plan.description}</p>
            )}

            {Object.values(plan.features).length > 0 && (
              <>
                <h3 className="text-base font-semibold mb-2">
                  What's Included:
                </h3>
                <ul className="space-y-3">
                  {Object.entries(plan.features).map(([key, feature]) => (
                    <li key={key} className="flex items-start text-sm gap-2">
                      <CheckIcon className="text-success mt-1 h-4 w-4 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium">{feature.label}</span>
                        {feature.pitch && (
                          <span className="text-xs italic text-default-500">
                            {feature.pitch}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {optionalItems.length > 0 && (
              <>
                <h3 className="text-base font-semibold mt-5 mb-2">
                  Optional Add-ons:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {optionalItems.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer transition-colors ${
                        selectedOptionals[item.id]
                          ? "bg-success-50 border border-success-200"
                          : "hover:bg-default-50 border border-transparent"
                      }`}
                    >
                      <Checkbox
                        color="success"
                        isSelected={!!selectedOptionals[item.id]}
                        onValueChange={() => toggleOptional(item.id)}
                      />
                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-default-500 italic mt-1">
                            {item.description}
                          </span>
                        )}
                        <span className="text-xs text-success-600 font-semibold mt-1">
                          +{" "}
                          <DualCurrencyPrice
                            usdPrice={getDiscountedAmount(item, "USD")}
                            gydPrice={getDiscountedAmount(item, "GYD")}
                          />
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
          </CardBody>
        </>
      )}

      <CardFooter className="flex flex-col items-start pt-4 gap-2">
        <div className="w-full p-3 bg-default-50 rounded-lg border border-default-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-default-700">
              You're Paying:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                <DualCurrencyPrice
                  usdPrice={oneTimeUSD}
                  gydPrice={oneTimeGYD}
                />
              </span>
              {selectedAddOnCount > 0 && (
                <span className="text-xs text-success-600">
                  ({selectedAddOnCount}{" "}
                  {pluralize(selectedAddOnCount, "add-on", "add-ons")} selected)
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          as={WhatsAppLink}
          message={whatsappMessage}
          color="primary"
          variant="solid"
          size="lg"
          className="w-full mt-2"
          endContent={<RocketIcon className="w-4 h-4" />}
          intent="Purchase"
          role="admin"
          page="pricing"
          orgId={orgUsername}
          funnel="upgrade"
        >
          Launch My School
        </Button>

        {/* Annual maintenance fee */}
        {(annualUSD > 0 || annualGYD > 0) && (
          <div className="w-full p-3 bg-default-50 rounded-lg border border-default-200 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-default-700">
                  {
                    plan.pricingPackage.pricingItems.find(
                      (item) => item.id === "annual-maintenance",
                    )?.label
                  }
                </span>
                <span className="text-xs text-default-500">
                  {
                    plan.pricingPackage.pricingItems.find(
                      (item) => item.id === "annual-maintenance",
                    )?.notes
                  }
                </span>
              </div>
              <span className="text-sm font-semibold text-default-700">
                <DualCurrencyPrice usdPrice={annualUSD} gydPrice={annualGYD} />
              </span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
