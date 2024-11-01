"use client";

import type { Session } from "@sovoli/auth";
import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

import { Button } from "../ui/button";
import { Link } from "../ui/link";

export interface HeaderActionsProps {
  knowledge: SelectKnowledgeSchema;
  session?: Session | null;
}

export function HeaderActions({ knowledge, session }: HeaderActionsProps) {
  return (
    <div>
      {session?.userId === knowledge.User?.id && (
        <Button
          href={`${knowledge.User?.username}/${knowledge.slug}/edit`}
          variant="bordered"
          size="sm"
          as={Link}
        >
          Edit
        </Button>
      )}
    </div>
  );
}
