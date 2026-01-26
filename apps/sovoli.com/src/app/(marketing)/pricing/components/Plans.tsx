// components/Plans.tsx
"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Switch } from "@sovoli/ui/components/switch";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import type { PlanDefinition } from "~/modules/plans/types";
import type { RuleSet } from "~/modules/scoring/types";
import { PlanCard } from "./PlanCard";

interface PlansProps {
  plans: PlanDefinition[];
  ruleSet: RuleSet;
  orgUsername?: string;
}

export function Plans({ plans, ruleSet: _ruleSet, orgUsername }: PlansProps) {
  const preferredCurrency = "USD";
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [cadence, setCadence] = useState<"monthly" | "annual">("monthly");

  const toggleExpand = (planKey: string) => {
    setExpanded((prev) => ({
      ...prev,
      [planKey]: !prev[planKey],
    }));
  };

  // Find Campaign Ads item from growth plan
  const growthPlan = plans.find((p) => p.key === "growth");
  const campaignAdsItem = growthPlan?.pricingPackage.pricingItems.find(
    (item) => item.id === "optional-campaign-ads",
  );

  return (
    <>
      <div className="col-span-full flex items-center justify-center pb-2">
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium ${
              cadence === "monthly" ? "text-foreground" : "text-default-500"
            }`}
          >
            Monthly
          </span>
          <Switch
            size="sm"
            isSelected={cadence === "annual"}
            onValueChange={(isYearly) =>
              setCadence(isYearly ? "annual" : "monthly")
            }
            aria-label="Toggle monthly or yearly billing"
          />
          <span
            className={`text-sm font-medium ${
              cadence === "annual" ? "text-foreground" : "text-default-500"
            }`}
          >
            Yearly
          </span>
          <span className="text-xs font-semibold text-success-700 bg-success-50 border border-success-200 rounded-full px-2 py-0.5">
            Save 15%
          </span>
        </div>
      </div>
      {plans.map((plan, idx) => {
        const showDetails = (idx === 0 || expanded[plan.key]) ?? false;
        const isGrowthPlan = plan.key === "growth";

        return (
          <div key={plan.key}>
            <PlanCard
              plan={plan}
              showDetails={showDetails}
              onToggleDetails={() => toggleExpand(plan.key)}
              isPrimary={idx === 0}
              orgUsername={orgUsername}
              preferredCurrency={preferredCurrency}
              cadence={cadence}
            />
            {/* Campaign Ads Service - shown right after Growth plan */}
            {isGrowthPlan && campaignAdsItem && (
              <Card className="overflow-visible border-2 border-primary/20 mt-4">
                <CardHeader className="pb-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {campaignAdsItem.label}
                    </h3>
                    <p className="text-sm text-default-600 mt-1">
                      We handle everything for your Meta advertising campaigns
                    </p>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-default-700 font-medium">
                        What we do for you:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <CheckIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
                          <span className="text-default-600">
                            Generate compelling ad copy that converts
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
                          <span className="text-default-600">
                            Create eye-catching images for your campaigns
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
                          <span className="text-default-600">
                            Target the right audience for maximum reach
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
                          <span className="text-default-600">
                            Run and manage your campaigns end-to-end
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-default-200">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          $50
                        </span>
                        <span className="text-base text-default-600">
                          / week
                        </span>
                        <span className="text-sm text-default-500">
                          (minimum)
                        </span>
                      </div>
                      <p className="text-xs text-default-500 mt-2">
                        Minimum 1 week campaign duration. The minimum spend
                        helps us get results and train our system to optimize
                        your campaigns for better performance.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        );
      })}
    </>
  );
}
