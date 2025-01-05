"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";

import type { Session } from "~/core/auth";

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
