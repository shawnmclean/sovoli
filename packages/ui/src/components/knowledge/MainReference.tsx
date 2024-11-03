import type { KnowledgeConnection } from "@sovoli/db/schema";

export interface MainReferenceProps {
  knowledgeConnection: KnowledgeConnection;
}

export function MainReference({ knowledgeConnection }: MainReferenceProps) {
  return (
    <div className="flex flex-col gap-4">
      Referencing: {knowledgeConnection.TargetKnowledge?.title}
    </div>
  );
}
