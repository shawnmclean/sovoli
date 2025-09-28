import type { KnowledgeConnection } from "@sovoli/db/schema";

export interface ReferenceListProps {
  knowledgeConnections: KnowledgeConnection[];
}

export function ReferenceList({ knowledgeConnections }: ReferenceListProps) {
  return (
    <div className="flex flex-col gap-4">
      {knowledgeConnections.map((knowledgeConnection) => {
        return (
          <div key={knowledgeConnection.id}>
            {knowledgeConnection.TargetKnowledge?.title}
          </div>
        );
      })}
    </div>
  );
}
