"use client";

import { growthPlan } from "~/modules/plans/data/growth";
import { PlanCard } from "../../pricing/components/PlanCard";

export function Pricing() {
  // Render pricing using shared PlanCard component

  return (
    <section className="py-12 px-4 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Pricing</h2>
        </div>

        <div>
          <PlanCard
            plan={growthPlan}
            showDetails={true}
            isPrimary={true}
            hideHeader={true}
            hideCta={true}
          />
        </div>

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
