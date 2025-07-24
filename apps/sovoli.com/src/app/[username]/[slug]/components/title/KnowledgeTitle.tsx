"use client";

import { useKnowledge } from "../../context/KnowledgeContext";

export function KnowledgeTitle() {
  const knowledge = useKnowledge();

  return (
    <div className="flex items-center">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">{knowledge.title}</h1>
      </div>
    </div>
  );
}
