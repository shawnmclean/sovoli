import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

export interface MainReferenceProps {
  knowledge: SelectKnowledgeSchema;
}

export function MainReference({ knowledge }: MainReferenceProps) {
  return (
    <div className="flex flex-col gap-4">Referencing: {knowledge.title}</div>
  );
}
