import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

import { Button } from "../ui/button";

export interface KnowledgeHeaderProps {
  knowledge: SelectKnowledgeSchema;
}

export function KnowledgeHeader({ knowledge }: KnowledgeHeaderProps) {
  return (
    <div className="flex w-full max-w-7xl justify-between">
      <h1 className="text-2xl font-bold">{knowledge.title}</h1>

      <div className="flex gap-4">
        <Button variant="bordered">Remix</Button>
        <Button variant="bordered">Star</Button>
      </div>
    </div>
  );
}
