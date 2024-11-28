import { task } from "@trigger.dev/sdk/v3";

import { knowledgeUpserted } from "~/services/knowledge/knowledgeUpserted";

export interface KnowledgeUpsertedEventOptions {
  knowledgeId: string;
}

export const knowledgeUpsertedEvent = task({
  id: "knowledge-upserted-event",
  run: async ({ knowledgeId }: KnowledgeUpsertedEventOptions, { ctx }) => {
    await knowledgeUpserted({ knowledgeId, jobId: ctx.run.id });
  },
});
