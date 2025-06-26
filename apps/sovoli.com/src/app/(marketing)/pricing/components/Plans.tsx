// components/Plans.tsx
"use client";

import React, { useState } from "react";
import type { RuleSet } from "~/modules/scoring/types";
import type { PlanDefinition } from "~/modules/plans/types";
import { PlanCard } from "./PlanCard";

interface PlansProps {
  plans: PlanDefinition[];
  ruleSet: RuleSet;
}

export function Plans({ plans, ruleSet: _ruleSet }: PlansProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (planKey: string) => {
    setExpanded((prev) => ({
      ...prev,
      [planKey]: !prev[planKey],
    }));
  };

  return (
    <>
      {plans.map((plan, idx) => {
        const showDetails = (idx === 0 || expanded[plan.key]) ?? false;

        return (
          <PlanCard
            key={plan.key}
            plan={plan}
            showDetails={showDetails}
            onToggleDetails={() => toggleExpand(plan.key)}
            isPrimary={idx === 0}
          />
        );
      })}
    </>
  );
}
