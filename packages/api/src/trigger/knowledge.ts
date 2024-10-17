import { task } from "@trigger.dev/sdk/v3";

import { knowledgeUpserted } from "../services/knowledge";

export interface HydrateKnowledgeOptions {
  knowledgeId: string;
}

export const hydrateKnowledge = task({
  id: "hydrate-knowledge",
  run: async ({ knowledgeId }: HydrateKnowledgeOptions) => {
    await knowledgeUpserted({ knowledgeId });
  },
});
