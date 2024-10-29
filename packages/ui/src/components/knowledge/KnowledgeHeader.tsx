import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

export interface KnowledgeHeaderProps {
  knowledge: SelectKnowledgeSchema;
}

export function KnowledgeHeader({ knowledge }: KnowledgeHeaderProps) {
  return (
    <div className="border-b border-divider px-6 py-3">
      <div className="flex flex-col justify-start">
        <h1 className="text-2xl font-bold">{knowledge.title}</h1>
      </div>
    </div>
  );
}
