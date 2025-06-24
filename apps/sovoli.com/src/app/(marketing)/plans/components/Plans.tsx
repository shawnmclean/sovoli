"use client";

import React, { useState } from "react";
import type { CategoryRuleSet } from "~/modules/scoring/types";
import type { PlanDefinition } from "~/modules/plans/types";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Button } from "@sovoli/ui/components/button";
import { CheckIcon } from "lucide-react";
import { Checkbox } from "@sovoli/ui/components/checkbox";

interface DualCurrencyPriceProps {
  usdPrice: number;
  gydPrice: number;
  className?: string;
}

function DualCurrencyPrice({
  usdPrice,
  gydPrice,
  className = "",
}: DualCurrencyPriceProps) {
  return (
    <span className={className}>
      {usdPrice.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}{" "}
      /{" "}
      {gydPrice.toLocaleString("en-US", {
        style: "currency",
        currency: "GYD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}
    </span>
  );
}

interface PlansProps {
  plans: PlanDefinition[];
  ruleSet: CategoryRuleSet;
}

export function Plans({ plans, ruleSet }: PlansProps) {
  const [selectedOptionals, setSelectedOptionals] = useState<
    Record<string, Partial<Record<string, boolean>>>
  >({});

  const toggleOptional = (planKey: string, offerKey: string) => {
    setSelectedOptionals((prev) => ({
      ...prev,
      [planKey]: {
        ...prev[planKey],
        [offerKey]: !prev[planKey]?.[offerKey],
      },
    }));
  };

  return (
    <>
      {plans.map((plan) => {
        const offerEntries = Object.entries(plan.offers);
        const included = offerEntries.filter(([_, offer]) => !offer?.optional);
        const optional = offerEntries.filter(
          ([_, offer]) => !!offer?.optional?.pricing,
        );

        const oneTimeBaseUSD = plan.pricing?.oneTime.USD ?? 0;
        const oneTimeBaseGYD = plan.pricing?.oneTime.GYD ?? 0;
        const yearlyPriceUSD = plan.pricing?.yearly.USD ?? 0;
        const yearlyPriceGYD = plan.pricing?.yearly.GYD ?? 0;

        const optionalTotalUSD = optional.reduce((sum, [offerKey, offer]) => {
          const price = offer?.optional?.pricing.USD;
          return price && selectedOptionals[plan.key]?.[offerKey]
            ? sum + price
            : sum;
        }, 0);

        const optionalTotalGYD = optional.reduce((sum, [offerKey, offer]) => {
          const price = offer?.optional?.pricing.GYD;
          return price && selectedOptionals[plan.key]?.[offerKey]
            ? sum + price
            : sum;
        }, 0);

        const totalOneTimeUSD = oneTimeBaseUSD + optionalTotalUSD;
        const totalOneTimeGYD = oneTimeBaseGYD + optionalTotalGYD;

        return (
          <Card key={plan.key} className="overflow-visible flex flex-col">
            <CardHeader className="flex flex-col items-start gap-2 pb-4">
              <h2 className="text-xl font-semibold">{plan.title}</h2>
              <p className="text-sm text-default-500">{plan.subtitle}</p>
            </CardHeader>

            <Divider />

            <CardBody className="flex-grow py-4">
              <p className="mb-4 text-sm">{plan.description}</p>

              {included.length > 0 && (
                <>
                  <h3 className="text-base font-semibold mt-4 mb-2">
                    What's Included:
                  </h3>
                  <ul className="space-y-3">
                    {included.map(([offerKey, offer]) => (
                      <li
                        key={offerKey}
                        className="flex items-start text-sm gap-2"
                      >
                        <CheckIcon className="text-success mt-1 h-4 w-4 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium">{offer?.label}</span>
                          {offer?.pitch && (
                            <span className="text-xs italic text-default-500">
                              {offer.pitch}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {optional.length > 0 && (
                <>
                  <h3 className="text-base font-semibold mt-6 mb-2">
                    Optional Add-ons:
                  </h3>
                  <ul className="space-y-3">
                    {optional.map(([offerKey, offer]) => {
                      const isSelected =
                        !!selectedOptionals[plan.key]?.[offerKey];
                      const usdPrice = offer?.optional?.pricing.USD ?? 0;
                      const gydPrice = offer?.optional?.pricing.GYD ?? 0;

                      return (
                        <li
                          key={offerKey}
                          className="flex items-start text-sm gap-2"
                        >
                          <Checkbox
                            id={`opt-${plan.key}-${offerKey}`}
                            isSelected={isSelected}
                            onValueChange={() =>
                              toggleOptional(plan.key, offerKey)
                            }
                            className="mt-1"
                          />
                          <div className="flex flex-col">
                            <label
                              htmlFor={`opt-${plan.key}-${offerKey}`}
                              className="font-medium cursor-pointer"
                            >
                              {offer?.label}
                            </label>
                            {offer?.pitch && (
                              <span className="text-xs italic text-default-500">
                                {offer.pitch}
                              </span>
                            )}
                            <span className="text-xs text-success-600 font-semibold">
                              {offer?.optional?.description
                                ? `${offer.optional.description} — `
                                : ""}
                              <DualCurrencyPrice
                                usdPrice={usdPrice}
                                gydPrice={gydPrice}
                              />
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </CardBody>

            <Divider />

            <CardFooter className="flex flex-col items-start pt-4 gap-3">
              {/* One-Time Fee */}
              <div className="text-sm">
                <strong>One-Time Fee:</strong>{" "}
                {plan.discount?.oneTime ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="line-through text-default-400">
                        <DualCurrencyPrice
                          usdPrice={plan.pricing?.oneTime.USD ?? 0}
                          gydPrice={plan.pricing?.oneTime.GYD ?? 0}
                        />
                      </span>
                      <span className="text-success-600 font-semibold">
                        <DualCurrencyPrice
                          usdPrice={plan.discount.oneTime.USD}
                          gydPrice={plan.discount.oneTime.GYD}
                        />
                      </span>
                    </div>
                    {plan.discount.message && (
                      <span className="text-xs text-success-700 mt-1">
                        {plan.discount.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <DualCurrencyPrice
                    usdPrice={totalOneTimeUSD}
                    gydPrice={totalOneTimeGYD}
                  />
                )}
              </div>

              {/* Annual Fee */}
              <div className="text-sm">
                <strong>Annual:</strong>{" "}
                <DualCurrencyPrice
                  usdPrice={yearlyPriceUSD}
                  gydPrice={yearlyPriceGYD}
                />
                {plan.pricing?.note && (
                  <span className="text-xs block text-default-500 mt-1">
                    {plan.pricing.note}
                  </span>
                )}
              </div>

              {/* Onboarding Note */}
              {plan.onboardingNode && (
                <p className="text-xs text-warning-600 mt-2">
                  {plan.onboardingNode}
                </p>
              )}

              <Button
                color="primary"
                variant="solid"
                size="lg"
                className="w-full mt-2"
              >
                Contact Us
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}
