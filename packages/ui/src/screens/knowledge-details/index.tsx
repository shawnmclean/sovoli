"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { KnowledgeDetails } from "@sovoli/ui/components/KnowledgeDetails/KnowledgeDetails";

interface Props {
  knowledge: SelectKnowledgeSchema;
}

export function KnowledgeDetailsScreen({ knowledge }: Props) {
  return <KnowledgeDetails knowledge={knowledge} />;
}
