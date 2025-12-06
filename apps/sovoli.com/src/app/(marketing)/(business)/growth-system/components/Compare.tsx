"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { CheckIcon, XIcon } from "lucide-react";

const comparisonFeatures = [
  {
    feature: "Education Industry Expertise",
    sovoli: true,
    devShops: false,
    description:
      "We specialize in private schools and understand parent behavior patterns",
  },
  {
    feature: "Complete Growth System",
    sovoli: true,
    devShops: false,
    description:
      "Integrated diagnostics, discovery, ads, website, and lead capture",
  },
  {
    feature: "Caribbean Market Knowledge",
    sovoli: true,
    devShops: false,
    description:
      "Built specifically for Caribbean private schools and local parent preferences",
  },
  {
    feature: "Ongoing Support & Training",
    sovoli: true,
    devShops: false,
    description:
      "Dedicated support team that understands your school's challenges",
  },
  {
    feature: "Proven Results",
    sovoli: true,
    devShops: false,
    description:
      "Track record of increasing enrollment for schools like Modern Academy",
  },
  {
    feature: "WhatsApp Integration",
    sovoli: true,
    devShops: false,
    description: "Purpose-built for Caribbean communication preferences",
  },
  {
    feature: "Transparent Pricing",
    sovoli: true,
    devShops: false,
    description:
      "No hidden costs or surprise charges - you know exactly what you're paying",
  },
  {
    feature: "Quick Setup",
    sovoli: true,
    devShops: false,
    description: "Get started in days, not months. See results within weeks",
  },
  {
    feature: "Generic Website Only",
    sovoli: false,
    devShops: true,
    description:
      "Basic website without growth systems or marketing integration",
  },
  {
    feature: "No Marketing Knowledge",
    sovoli: false,
    devShops: true,
    description:
      "Build websites but don't understand how to drive traffic or convert leads",
  },
  {
    feature: "High Upfront Costs",
    sovoli: false,
    devShops: true,
    description: "Large initial investment with no guarantee of results",
  },
  {
    feature: "No Ongoing Support",
    sovoli: false,
    devShops: true,
    description: "Build it and leave you to figure it out on your own",
  },
];

export function Compare() {
  return (
    <section className="py-8 px-4 sm:py-16 bg-default-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Why Choose Sovoli Over Dev Shops?
          </h2>
          <p className="text-base sm:text-lg text-default-600 max-w-3xl mx-auto px-4">
            Most dev shops build websites they don't understand. We build growth
            systems specifically for private schools in the Caribbean.
          </p>
        </div>

        <Card className="bg-background overflow-hidden">
          <CardHeader className="bg-primary-50 p-6">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <h3 className="font-semibold text-lg">Feature</h3>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-primary-600">
                  Sovoli Growth System
                </h3>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-default-500">
                  Generic Dev Shops
                </h3>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {comparisonFeatures.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 items-center p-6 ${
                  index % 2 === 0 ? "bg-default-50" : "bg-background"
                }`}
              >
                <div className="pr-4">
                  <h4 className="font-medium text-default-800 mb-1">
                    {item.feature}
                  </h4>
                  <p className="text-sm text-default-600">{item.description}</p>
                </div>
                <div className="text-center">
                  {item.sovoli ? (
                    <CheckIcon className="h-6 w-6 text-success-500 mx-auto" />
                  ) : (
                    <XIcon className="h-6 w-6 text-danger-500 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  {item.devShops ? (
                    <CheckIcon className="h-6 w-6 text-success-500 mx-auto" />
                  ) : (
                    <XIcon className="h-6 w-6 text-danger-500 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <div className="mt-8 text-center">
          <div className="bg-primary-50 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-semibold mb-4">The Bottom Line</h3>
            <p className="text-default-600 mb-6 max-w-3xl mx-auto">
              Dev shops build websites. We build growth systems. While they're
              coding generic solutions, we're optimizing for Caribbean private
              schools and parent behavior patterns. The result? Schools that
              choose Sovoli see real enrollment growth, not just a pretty
              website.
            </p>
            <div className="text-sm text-default-500">
              <p className="mb-2">
                ✓ Proven results with schools like Modern Academy
              </p>
              <p className="mb-2">
                ✓ Industry expertise you can't get from generic developers
              </p>
              <p>
                ✓ Ongoing support from a team that understands your challenges
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
