"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { createContext, useContext } from "react";

export const KnowledgeContext = createContext<SelectKnowledgeSchema | null>(
  null,
);

export const useKnowledge = () => {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error("useKnowledge must be used within a KnowledgeProvider");
  }
  return context;
};

export const KnowledgeProvider = ({
  children,
  knowledge,
}: {
  children: React.ReactNode;
  knowledge: SelectKnowledgeSchema;
}) => {
  return <KnowledgeContext value={knowledge}>{children}</KnowledgeContext>;
};
