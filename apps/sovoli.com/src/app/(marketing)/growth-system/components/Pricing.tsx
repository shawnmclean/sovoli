"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { CheckIcon } from "lucide-react";
import { growthPlan } from "~/modules/plans/data/growth";

export function Pricing() {
  const setupFee = growthPlan.pricingPackage.pricingItems.find(
    (item) => item.id === "setup",
  );
  const annualMaintenance = growthPlan.pricingPackage.pricingItems.find(
    (item) => item.id === "annual-maintenance",
  );

  const formatGYD = (amount: number | undefined): string => {
    if (!amount) return "—";
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (!setupFee || !annualMaintenance) {
    return null;
  }

  return (
    <section className="py-12 px-4 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Pricing
          </h2>
          <p className="text-default-500 text-lg">
            Transparent pricing with everything you need to get started
          </p>
        </div>

        <Card className="bg-background shadow-xl ring-1 ring-default-200">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">
                    GYD ${formatGYD(setupFee.amount.GYD)}
                  </span>
                </div>
                <p className="text-sm text-default-500 font-medium">
                  One-time setup fee
                </p>
                {setupFee.notes && (
                  <p className="text-xs text-default-400 mt-2 max-w-md mx-auto">
                    {setupFee.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 my-6">
                <div className="flex-1 h-px bg-default-200" />
                <span className="text-default-400 text-sm font-medium">
                  Plus
                </span>
                <div className="flex-1 h-px bg-default-200" />
              </div>

              <div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-foreground">
                    GYD ${formatGYD(annualMaintenance.amount.GYD)}
                  </span>
                  <span className="text-base text-default-500">/year</span>
                </div>
                <p className="text-sm text-default-500 font-medium">
                  Annual maintenance
                </p>
                {annualMaintenance.notes && (
                  <p className="text-xs text-default-400 mt-2 max-w-md mx-auto">
                    {annualMaintenance.notes}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardBody className="pt-6 pb-8">
            <div className="border-t border-default-200 pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
                What&apos;s Included
              </h3>
              <ul className="space-y-4">
                {Object.values(growthPlan.features).map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <CheckIcon className="h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-default-700 font-medium block">
                        {feature.label}
                      </span>
                      {feature.pitch && (
                        <p className="text-sm text-default-500 mt-1">
                          {feature.pitch}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-default-500">
            <span className="font-medium text-default-600">Note:</span> Campaign
            ad spend is separate and will be discussed during onboarding.
          </p>
        </div>
      </div>
    </section>
  );
}
