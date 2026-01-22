"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Image } from "@sovoli/ui/components/image";
import { Link } from "@sovoli/ui/components/link";
import type { GrowthSystemContent } from "../../categories";

interface CustomersProps {
  content: GrowthSystemContent["customers"];
}

export function Customers({ content }: CustomersProps) {
  return (
    <section className="py-6 px-4 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">{content.title}</h2>
        </div>

        <div className="space-y-4">
          {content.customers.map((customer, index) => (
            <Card key={index} className="bg-background">
              <CardBody>
                <div className="flex flex-col gap-2">
                  {/* Header with Logo, Company Name, and Case Study Button */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {/* Company Logo */}
                      <Image
                        src={customer.logo}
                        alt={`${customer.company} logo`}
                        width={40}
                        height={40}
                        className="flex-shrink-0"
                      />
                      <div className="flex flex-col gap-0.5">
                        {/* Company Name */}
                        <h3 className="text-xl font-semibold text-default-800">
                          {customer.company}
                        </h3>
                        {/* Category */}
                        {customer.category && (
                          <p className="text-sm text-default-500">
                            {customer.category}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Case Study Button */}
                    <Button
                      as={Link}
                      target="_blank"
                      href={customer.caseStudyLink}
                      variant="solid"
                      color="primary"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      View
                    </Button>
                  </div>

                  {/* Achievement/Title */}
                  <div>
                    <h4 className="text-lg font-bold text-default-900">
                      {customer.title}
                    </h4>
                  </div>

                  {/* Quote */}
                  <div>
                    <blockquote className="text-default-600 italic text-sm">
                      "{customer.quote}"
                    </blockquote>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
