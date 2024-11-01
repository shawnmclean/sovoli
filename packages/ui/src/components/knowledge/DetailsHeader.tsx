"use client";

import type { Session } from "@sovoli/auth";
import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { useState } from "react";

import { Button } from "../ui/button";

export interface DetailsHeaderProps {
  knowledge: SelectKnowledgeSchema;
  session?: Session | null;
}

export function DetailsHeader({ knowledge, session }: DetailsHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditHeader
        knowledge={knowledge}
        onCancel={() => setIsEditing(false)}
        onSaved={() => setIsEditing(false)}
      />
    );
  }
  return (
    <ShowHeader
      knowledge={knowledge}
      session={session}
      onEdit={() => setIsEditing(true)}
    />
  );
}

function ShowHeader({
  knowledge,
  session,
  onEdit,
}: DetailsHeaderProps & { onEdit: () => void }) {
  return (
    <div className="flex w-full max-w-7xl items-center justify-between p-6">
      <h1 className="text-2xl font-bold">{knowledge.title}</h1>
      <div className="flex gap-4">
        {session?.userId === knowledge.User?.id && (
          <Button variant="bordered" size="sm" onClick={() => onEdit()}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

function EditHeader({
  knowledge,
  onCancel,
  onSaved,
}: DetailsHeaderProps & { onCancel: () => void; onSaved: () => void }) {
  return (
    <div className="flex w-full max-w-7xl items-center justify-between p-6">
      <input
        type="text"
        placeholder="Title"
        className="w-full"
        value={knowledge.title ?? ""}
      />
      <Button variant="bordered" size="sm" onClick={() => onSaved()}>
        Save
      </Button>
      <Button variant="bordered" size="sm" onClick={() => onCancel()}>
        Cancel
      </Button>
    </div>
  );
}
