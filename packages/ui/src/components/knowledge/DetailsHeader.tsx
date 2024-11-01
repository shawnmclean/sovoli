"use client";

import type { Session } from "@sovoli/auth";
import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

import { Button } from "../ui/button";

export interface DetailsHeaderProps {
  knowledge: SelectKnowledgeSchema;
  session?: Session | null;
}

export function DetailsHeader({ knowledge, session }: DetailsHeaderProps) {
  return (
    <div className="flex w-full max-w-7xl items-center justify-between p-6">
      <h1 className="text-2xl font-bold">{knowledge.title}</h1>
      <div className="flex gap-4">
        {session?.userId === knowledge.User?.id && (
          <Button
            variant="bordered"
            size="sm"
            onClick={() => console.log("hi")}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
