import React from "react";
import { Plans } from "./components/Plans";
import { plans } from "~/modules/plans/data";
import { ruleSets } from "~/modules/scoring/ruleSets";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans",
  description:
    "Choose the plan that fits your needs and watch your school's visibility soar",
};

export default function PricingPage() {
  const ruleSet = ruleSets["private-school"];

  if (!ruleSet) {
    return <div>No rule set found</div>;
  }

  return (
    <main className="mx-auto w-full max-w-screen-lg px-4 pb-16 pt-6">
      <h1 className="text-4xl font-bold text-center mb-4">
        Elevate Your School&apos;s Online Presence
      </h1>
      <p className="text-xl text-center text-default-600 mb-12">
        Choose the plan that fits your needs and watch your school&apos;s
        visibility soar
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Plans plans={plans} ruleSet={ruleSet} />
      </div>
    </main>
  );
}
