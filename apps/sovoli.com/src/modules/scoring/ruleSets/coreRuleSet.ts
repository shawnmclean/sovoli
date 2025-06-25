import type { RuleSet } from "../types";

export const coreRuleSet: RuleSet = {
  groups: [
    {
      key: "core",
      label: "Core",
      weight: 2,
      rules: ["isVerified", "isClaimed"],
    },
  ],
  ruleMetadata: {
    isVerified: {
      key: "isVerified",
      label: "Verified Organization",
      description: "Indicates the organization is verified.",
      reasons: ["To ensure the organization is legitimate."],
      actions: ["Submit verification documents."],
      requirements: ["Submit verification documents."],
      effort: "low",
      includedInPlan: [],
    },
    isClaimed: {
      key: "isClaimed",
      label: "Claimed Organization",
      description: "Indicates the organization is claimed.",
      reasons: ["To ensure the organization is legitimate."],
      actions: ["Submit verification documents."],
      requirements: ["Submit verification documents."],
      effort: "low",
      includedInPlan: [],
    },
  },
};
