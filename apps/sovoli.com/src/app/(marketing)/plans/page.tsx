import React from "react";
import { Plans } from "./components/Plans";
import { plans } from "~/modules/plans/data";
import { ruleSets } from "~/modules/scoring/ruleSets";

export default function PricingPage() {
  const ruleSet = ruleSets["private-school"];

  if (!ruleSet) {
    return <div>No rule set found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Plans plans={plans} ruleSet={ruleSet} />
      </div>
    </div>
  );
}
