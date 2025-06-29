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

  // Calculate discounted prices
  const discountPercentage = plan.discount?.percentage ?? 0;
  const discountedBaseUSD = oneTimeBaseUSD * (1 - discountPercentage / 100);
  const discountedBaseGYD = oneTimeBaseGYD * (1 - discountPercentage / 100);

  // Add optional add-ons to discounted base price
  const discountedUSD = discountedBaseUSD + optionalTotalUSD;
  const discountedGYD = discountedBaseGYD + optionalTotalGYD;

  // Count selected add-ons
  const selectedAddOnCount =
    Object.values(selectedOptionals).filter(Boolean).length;

  // Get selected add-on labels
  const selectedAddOnLabels = optional
    .filter(([offerKey]) => selectedOptionals[offerKey])
    .map(([_, offer]) => offer.label);

  // Create WhatsApp message
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
        {plan.discount && (
          <div className="bg-success-50 border border-success-200 rounded-lg px-3 py-1">
            <div className="flex items-center gap-2">
              <span className="text-success-700 font-semibold text-sm">
                {discountPercentage}% OFF
              </span>
              {plan.discount.message && (
                <span className="text-success-600 text-xs">
                  • {plan.discount.message}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="text-xl font-medium mt-1">
          {plan.discount ? (
            <>
              <span className="text-success-600">
                <DualCurrencyPrice
                  usdPrice={discountedUSD}
                  gydPrice={discountedGYD}
                />
              </span>
              <div className="text-default-400 line-through text-sm mt-1">
                <DualCurrencyPrice
                  usdPrice={totalOneTimeUSD}
                  gydPrice={totalOneTimeGYD}
                />
              </div>
            </>
          ) : (
            <DualCurrencyPrice
              usdPrice={totalOneTimeUSD}
              gydPrice={totalOneTimeGYD}
            />
          )}
        </div>
        <div className="text-sm">
          Annual:{" "}
          <DualCurrencyPrice
            usdPrice={yearlyPriceUSD}
            gydPrice={yearlyPriceGYD}
          />
        </div>
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
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer transition-colors ${
                          selectedOptionals[offerKey]
                            ? "bg-success-50 border border-success-200"
                            : "hover:bg-default-50 border border-transparent"
                        }`}
                      >
                        <Checkbox
                          color="success"
                          isSelected={!!selectedOptionals[offerKey]}
                          onValueChange={() => toggleOptional(offerKey)}
                        />
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{offer.label}</span>

                          {offer.pitch && (
                            <span className="text-xs text-default-500 italic mt-1">
                              {offer.pitch}
                            </span>
                          )}

                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {offer.ctaLabel && (
                              <span className="text-xs text-success-600 font-medium">
                                {offer.ctaLabel}
                              </span>
                            )}
                            <span className="text-xs text-success-600 font-semibold">
                              +{" "}
                              <DualCurrencyPrice
                                usdPrice={usdPrice}
                                gydPrice={gydPrice}
                              />
                            </span>
                          </div>
                        </div>
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
        {/* You're Paying Section */}
        <div className="w-full p-3 bg-default-50 rounded-lg border border-default-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-default-700">
              You're Paying:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                <DualCurrencyPrice
                  usdPrice={plan.discount ? discountedUSD : totalOneTimeUSD}
                  gydPrice={plan.discount ? discountedGYD : totalOneTimeGYD}
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
          intent="upgrade_school"
          role="admin"
          page="pricing"
          orgId={orgUsername}
          funnel="upgrade"
        >
          Launch My School
        </Button>
        {plan.pricing?.note && (
          <p className="text-xs text-default-500">{plan.pricing.note}</p>
        )}
      </CardFooter>
    </Card>
  );
}
