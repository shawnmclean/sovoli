"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import KnowledgeDetails from "@sovoli/ui/components/KnowledgeDetails/KnowledgeDetails";
import { VStack } from "@sovoli/ui/components/ui/vstack";

interface Props {
  knowledge: SelectKnowledgeSchema;
}

export function KnowledgeDetailsScreen({ knowledge }: Props) {
  return (
    <VStack
      className="mb-20 h-full w-full max-w-[1500px] self-center p-4 pb-0 md:mb-2 md:px-10 md:pb-0 md:pt-6"
      space="2xl"
    >
      <KnowledgeDetails knowledge={knowledge} />
    </VStack>
  );
}
