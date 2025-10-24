"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";

const customers = [
  {
    company: "Modern Academy",
    title: "Increased enrollment by 40% in first semester",
    quote:
      "The Growth System helped us connect with parents we never would have reached. Our website now generates qualified leads every week.",
    caseStudyLink: "/case-studies/modern-academy",
  },
  {
    company: "St. Joseph's Preparatory",
    title: "Reduced marketing costs by 60% while doubling inquiries",
    quote:
      "We were spending thousands on ineffective ads. Now we have a system that works and costs less than hiring a marketing agency.",
    caseStudyLink: "/case-studies/st-josephs",
  },
  {
    company: "Guyana Academy of Excellence",
    title: "Achieved 100% digital readiness score",
    quote:
      "From having no online presence to being the top-ranked school in our area. The transformation has been incredible.",
    caseStudyLink: "/case-studies/guyana-academy",
  },
];

export function Customers() {
  return (
    <section className="py-8 px-4 sm:py-16 bg-default-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Schools Already Growing With Sovoli
          </h2>
          <p className="text-base sm:text-lg text-default-600 max-w-2xl mx-auto px-4">
            See how private schools across Guyana are using the Growth System to
            increase enrollment and reduce marketing costs.
          </p>
        </div>

        <div className="space-y-6">
          {customers.map((customer, index) => (
            <Card key={index} className="bg-background">
              <CardBody className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Company Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary-600 mb-2">
                      {customer.company}
                    </h3>
                    <h4 className="text-lg font-medium text-default-800 mb-3">
                      {customer.title}
                    </h4>
                    <blockquote className="text-default-600 italic">
                      "{customer.quote}"
                    </blockquote>
                  </div>

                  {/* Case Study Link */}
                  <div className="flex-shrink-0">
                    <Button
                      as={Link}
                      href={customer.caseStudyLink}
                      variant="bordered"
                      color="primary"
                      className="w-full sm:w-auto"
                    >
                      View Case Study
                    </Button>
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
