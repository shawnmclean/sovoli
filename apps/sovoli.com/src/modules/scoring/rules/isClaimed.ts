import type { OrgScoreRule } from "../types";

export const isClaimed: OrgScoreRule = {
  key: "isClaimed",
  maxScore: 10,
  compute: ({ org }) => {
    switch (org.internalCRM?.claimStatus) {
      case "claimed":
        return Promise.resolve({
          score: 10,
          description: "This organization is claimed.",
        });
      case "pending":
        return Promise.resolve({
          score: 5,
          description: "This organization is pending claim.",
        });
      default:
        return Promise.resolve({
          score: 0,
          description: "This organization is unclaimed.",
        });
    }
  },
};
