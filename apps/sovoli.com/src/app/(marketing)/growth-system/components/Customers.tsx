"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { Image } from "@sovoli/ui/components/image";

const customers = [
  {
    company: "Modern Academy",
    title: "Increased calls by 300%",
    quote:
      "We were getting 2 calls per week from ads, now we're getting 6-8 calls per week without ads.",
    caseStudyLink: "https://www.ma.edu.gy?ref=sovoli-case-study",
    logo: "/images/orgs/private-schools/guyana/modernacademy/logo.webp",
  },
  {
    company: "Fit Right Academy",
    title: "Got our first few students",
    quote: "Found the right students for our program.",
    caseStudyLink: "https://www.fitright.gy?ref=sovoli-case-study",
    logo: "/images/orgs/vocational-training/guyana/fitright/logo.webp",
  },
];

export function Customers() {
  return (
    <section className="py-8 px-4 sm:py-16 bg-default-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Schools Already Growing With Sovoli
          </h2>
        </div>

        <div className="space-y-4">
          {customers.map((customer, index) => (
            <Card key={index} className="bg-background">
              <CardBody>
                <div className="flex flex-col gap-2">
                  {/* Header with Logo, Company Name, and Case Study Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Company Logo */}
                      <Image
                        src={customer.logo}
                        alt={`${customer.company} logo`}
                        width={32}
                        height={32}
                      />
                      {/* Company Name */}
                      <h3 className="text-xl font-semibold text-primary">
                        {customer.company}
                      </h3>
                    </div>

                    {/* Case Study Button */}
                    <Button
                      as={Link}
                      target="_blank"
                      href={customer.caseStudyLink}
                      variant="bordered"
                      color="default"
                      size="sm"
                    >
                      View
                    </Button>
                  </div>

                  {/* Achievement/Title */}
                  <div>
                    <h4 className="text-lg font-bold text-default-800">
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
