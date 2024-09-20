import { relations } from "drizzle-orm";

import { Knowledge } from "./Knowledge";
import { KnowledgeConnection } from "./KnowledgeConnection";

export const KnowledgeConnectopmRelations = relations(
  KnowledgeConnection,
  ({ one }) => ({
    TargetKnowledge: one(Knowledge, {
      fields: [KnowledgeConnection.targetKnowledgeId],
      references: [Knowledge.id],
    }),
    SourceKnowledge: one(Knowledge, {
      fields: [KnowledgeConnection.sourceKnowledgeId],
      references: [Knowledge.id],
    }),
  }),
);
