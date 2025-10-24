"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { CheckIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { growthPlan } from "~/modules/plans/data/growth";

export function Pricing() {
  const setupFee = growthPlan.pricingPackage.pricingItems.find(
    (item) => item.id === "setup",
  );
  const annualMaintenance = growthPlan.pricingPackage.pricingItems.find(
    (item) => item.id === "annual-maintenance",
  );

  return (
    <section className="py-8 px-4 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-default-600 max-w-2xl mx-auto px-4">
            One complete solution that includes everything you need to grow your
            school's enrollment.
          </p>
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

            <div className="space-y-4">
              <WhatsAppLink
                intent="Contact"
                role="admin"
                page="pricing"
                funnel="growth-system"
                message="Hi! I'm interested in the Growth System for my school. Can we discuss the details?"
              >
                <Button
                  variant="bordered"
                  color="success"
                  size="lg"
                  className="w-full"
                >
                  Message on WhatsApp
                </Button>
              </WhatsAppLink>
            </div>
          </CardBody>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-default-500 mb-4">
            Includes setup, onboarding, and 30-day money-back guarantee. No
            long-term contracts.
          </p>
          <p className="text-sm text-default-500">
            Need a custom solution? Contact us for enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  );
}
