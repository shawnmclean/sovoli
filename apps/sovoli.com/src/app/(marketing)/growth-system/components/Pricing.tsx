"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { CheckIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";

const pricingPlans = [
  {
    name: "Starter",
    price: "$297",
    period: "per month",
    description: "Perfect for small schools (50-150 students)",
    features: [
      "Digital readiness assessment",
      "Basic website setup",
      "Google Business Profile optimization",
      "WhatsApp lead capture",
      "Monthly performance report",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$497",
    period: "per month",
    description: "Ideal for medium schools (150-300 students)",
    features: [
      "Everything in Starter",
      "Advanced website with custom design",
      "Facebook & Google advertising setup",
      "Lead qualification automation",
      "Monthly strategy calls",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$797",
    period: "per month",
    description: "For large schools (300+ students)",
    features: [
      "Everything in Growth",
      "Custom integrations",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "Weekly strategy calls",
      "24/7 phone support",
    ],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="py-8 px-4 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-default-600 max-w-2xl mx-auto px-4">
            Choose the plan that fits your school's size and growth goals. All
            plans include setup and onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`bg-background ${plan.popular ? "ring-2 ring-primary-500 shadow-lg" : ""}`}
            >
              <CardHeader className="text-center pb-4">
                {plan.popular && (
                  <div className="bg-primary-500 text-background px-3 py-1 rounded-full text-sm font-medium mb-4 mx-auto w-fit">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-primary-600">
                    {plan.price}
                  </span>
                  <span className="text-default-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-default-600">{plan.description}</p>
              </CardHeader>
              <CardBody className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckIcon className="h-4 w-4 text-success-500 flex-shrink-0" />
                      <span className="text-sm text-default-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button
                    color={plan.popular ? "primary" : "default"}
                    variant={plan.popular ? "solid" : "bordered"}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                  <WhatsAppLink
                    intent="Contact"
                    role="admin"
                    page="pricing"
                    funnel="growth-system"
                    message={`Hi! I'm interested in the ${plan.name} plan for my school. Can we discuss the details?`}
                  >
                    <Button variant="light" color="success" className="w-full">
                      Message on WhatsApp
                    </Button>
                  </WhatsAppLink>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-default-500 mb-4">
            All plans include a 30-day money-back guarantee. No long-term
            contracts.
          </p>
          <p className="text-sm text-default-500">
            Need a custom solution?{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact us
            </Link>{" "}
            for enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  );
}
