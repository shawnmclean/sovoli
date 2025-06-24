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
import { CheckIcon } from "lucide-react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { DualCurrencyPrice } from "./DualCurrencyPrice";
import type { PlanDefinition } from "~/modules/plans/types";

interface PlanCardProps {
  plan: PlanDefinition;
  showDetails: boolean;
  onToggleDetails?: () => void;
  isPrimary?: boolean;
}

export function PlanCard({
  plan,
  showDetails,
  onToggleDetails,
  isPrimary = false,
}: PlanCardProps) {
  const [selectedOptionals, setSelectedOptionals] = useState<
    Record<string, boolean>
  >({});

  const toggleOptional = (offerKey: string) => {
    setSelectedOptionals((prev) => ({
      ...prev,
      [offerKey]: !prev[offerKey],
    }));
  };

  // Compute included and optional offers
  const offerEntries = Object.entries(plan.offers).filter(
    ([_, offer]) => offer !== undefined,
  ) as [string, NonNullable<(typeof plan.offers)[string]>][];

  const included = offerEntries.filter(([_, offer]) => !offer.optional);
  const optional = offerEntries.filter(
    ([_, offer]) => !!offer.optional?.pricing,
  );

  // Compute pricing
  const oneTimeBaseUSD = plan.pricing?.oneTime.USD ?? 0;
  const oneTimeBaseGYD = plan.pricing?.oneTime.GYD ?? 0;
  const yearlyPriceUSD = plan.pricing?.yearly.USD ?? 0;
  const yearlyPriceGYD = plan.pricing?.yearly.GYD ?? 0;

  const optionalTotalUSD = optional.reduce((sum, [offerKey, offer]) => {
    const price = offer.optional?.pricing.USD;
    return price && selectedOptionals[offerKey] ? sum + price : sum;
  }, 0);

  const optionalTotalGYD = optional.reduce((sum, [offerKey, offer]) => {
    const price = offer.optional?.pricing.GYD;
    return price && selectedOptionals[offerKey] ? sum + price : sum;
  }, 0);

  const totalOneTimeUSD = oneTimeBaseUSD + optionalTotalUSD;
  const totalOneTimeGYD = oneTimeBaseGYD + optionalTotalGYD;

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
        <div className="text-xl font-medium mt-1">
          {plan.discount ? (
            <span className="text-success-600">
              <DualCurrencyPrice
                usdPrice={plan.discount.oneTime.USD + optionalTotalUSD}
                gydPrice={plan.discount.oneTime.GYD + optionalTotalGYD}
              />
            </span>
          ) : (
            <DualCurrencyPrice
              usdPrice={totalOneTimeUSD}
              gydPrice={totalOneTimeGYD}
            />
          )}
          {plan.discount && (
            <span className="text-default-400 line-through ml-2 text-sm">
              <DualCurrencyPrice usdPrice={totalOneTimeUSD} />
            </span>
          )}
        </div>
        {plan.discount?.message && (
          <p className="text-xs text-success-700">{plan.discount.message}</p>
        )}
        <div className="text-sm">
          Annual:{" "}
          <DualCurrencyPrice
            usdPrice={yearlyPriceUSD}
            gydPrice={yearlyPriceGYD}
          />
        </div>
      </CardHeader>

      {showDetails && (
        <>
          <Divider />
          <CardBody className="py-4 flex-grow">
            {plan.description && (
              <p className="mb-4 text-sm">{plan.description}</p>
            )}

            {included.length > 0 && (
              <>
                <h3 className="text-base font-semibold mb-2">
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
                        <span className="font-medium">{offer.label}</span>
                        {offer.pitch && (
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
                <h3 className="text-base font-semibold mt-5 mb-2">
                  Optional Add-ons:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {optional.map(([offerKey, offer]) => {
                    const usdPrice = offer.optional?.pricing.USD ?? 0;
                    const gydPrice = offer.optional?.pricing.GYD ?? 0;
                    return (
                      <label
                        key={offerKey}
                        className="flex items-center gap-2 rounded-xl px-3 py-1 text-sm cursor-pointer"
                      >
                        <Checkbox
                          isSelected={!!selectedOptionals[offerKey]}
                          onValueChange={() => toggleOptional(offerKey)}
                        />
                        {offer.label}
                        <span className="text-xs text-success-600 ml-1">
                          +{" "}
                          <DualCurrencyPrice
                            usdPrice={usdPrice}
                            gydPrice={gydPrice}
                          />
                        </span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </CardBody>
        </>
      )}

      <CardFooter className="flex flex-col items-start pt-4 gap-2">
        {plan.onboardingNode && (
          <p className="text-xs text-warning-600">{plan.onboardingNode}</p>
        )}
        <Button
          color="primary"
          variant="solid"
          size="lg"
          className="w-full mt-2"
        >
          Contact Us
        </Button>
        {plan.pricing?.note && (
          <p className="text-xs text-default-500">{plan.pricing.note}</p>
        )}
      </CardFooter>
    </Card>
  );
}
