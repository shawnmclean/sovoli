"use client";

import React from "react";
import { Stepper } from "@sovoli/ui/components/stepper";

export function Roadmap() {
  const roadmapSteps = [
    {
      label: "Referral Programs",
      completed: false,
      active: true,
    },
    {
      label: "Events",
      completed: false,
      active: false,
    },
  ];

  return (
    <section className="py-6 px-4 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Growth Roadmap
          </h2>
          <p className="text-default-600 max-w-2xl mx-auto">
            Our strategic roadmap for expanding your school's reach and impact
            through targeted growth initiatives.
          </p>
        </div>

        <div className="bg-background rounded-lg border border-default-200 p-6 sm:p-8">
          <Stepper steps={roadmapSteps} currentStep={0} className="w-full" />

          <div className="mt-8 text-sm text-default-500 text-center">
            <p>
              Follow our proven roadmap to systematically grow your school's
              enrollment and community engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
