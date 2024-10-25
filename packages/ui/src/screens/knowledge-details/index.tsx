"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { KnowledgeDetails } from "@sovoli/ui/components/KnowledgeDetails/KnowledgeDetails";

interface Props {
  knowledge: SelectKnowledgeSchema;
}

export function KnowledgeDetailsScreen({ knowledge }: Props) {
  return (
    <div
      className="mb-20 h-full w-full max-w-[1500px] self-center p-4 pb-0 md:mb-2 md:px-10 md:pb-0 md:pt-6"
    >
      <KnowledgeDetails knowledge={knowledge} />
    </div>
  );
}
