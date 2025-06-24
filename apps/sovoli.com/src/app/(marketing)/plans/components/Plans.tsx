import React from "react";
import type { CategoryRuleSet } from "~/modules/scoring/types";
import type { PlanDefinition } from "~/modules/plans/types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Button } from "@sovoli/ui/components/button";
import { CheckIcon } from "lucide-react";

interface PlansProps {
  plans: PlanDefinition[];
  ruleSet: CategoryRuleSet;
}

export function Plans({ plans, ruleSet }: PlansProps) {
  const calculateScoreBoost = (rulesCovered: string[]): number => {
    return ruleSet.groups.reduce((total, group) => {
      const coveredRules = group.rules.filter((rule) =>
        rulesCovered.includes(rule),
      );
      return total + coveredRules.length * group.weight;
    }, 0);
  };

  return (
    <>
      {plans.map((plan) => (
        <Card key={plan.key} className="overflow-visible">
          <CardHeader className="flex flex-col items-start gap-2 pb-6">
            <h2 className="text-2xl font-semibold">{plan.title}</h2>
            <p className="text-default-500">{plan.subtitle}</p>
          </CardHeader>
          <Divider />
          <CardBody className="py-6">
            <p className="mb-4">{plan.description}</p>
            <h3 className="text-lg font-semibold mt-6 mb-3">
              Features Covered:
            </h3>
            <ul className="space-y-2">
              {plan.includedRules.map((rule) => {
                const ruleMetadata = ruleSet.ruleMetadata[rule];
                return (
                  <li key={rule} className="flex items-start">
                    <CheckIcon className="text-success mr-2 mt-1 flex-shrink-0" />
                    <span>{ruleMetadata?.label}</span>
                  </li>
                );
              })}
            </ul>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-col items-start pt-6">
            <p className="text-xl font-bold mb-4">
              Score Boost: +{calculateScoreBoost(plan.includedRules).toFixed(1)}
            </p>
            <Button
              color="primary"
              variant="solid"
              size="lg"
              className="w-full"
            >
              Contact Us
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
