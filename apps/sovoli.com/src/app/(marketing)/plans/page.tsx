import React from "react";
import { Plans } from "./components/Plans";
import { plans } from "~/modules/plans/data";
import { ruleSets } from "~/modules/scoring/ruleSets";
import type { Metadata } from "next";
import { HeroSection } from "../components/HeroSection";

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
    <main className="mx-auto w-full max-w-screen-lg px-4 pb-16 pt-2">
      <HeroSection
        title="Elevate Your School"
        subtitle="Choose the plan that fits your needs and watch your school's visibility soar"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Plans plans={plans} ruleSet={ruleSet} />
      </div>
    </main>
  );
}
