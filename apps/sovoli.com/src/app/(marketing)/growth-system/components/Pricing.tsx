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

  return (
    <section className="py-6 px-2 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Pricing</h2>
        </div>

        <Card className="bg-background shadow-lg ring-2 ring-primary-500">
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <span className="text-4xl font-bold text-primary-600">
                ${setupFee?.amount.USD}
              </span>
              <span className="text-default-500 ml-1">
                setup + ${annualMaintenance?.amount.USD}/year
              </span>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-4 mb-8">
              {Object.values(growthPlan.features).map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-success-500 flex-shrink-0" />
                  <div>
                    <span className="text-default-700 font-medium">
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
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
