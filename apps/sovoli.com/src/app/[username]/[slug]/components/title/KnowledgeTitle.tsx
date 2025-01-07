"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { useSession } from "next-auth/react";

import { useKnowledge } from "../../context/KnowledgeContext";
import { TitleUpdateForm } from "./TitleUpdateForm";

export function KnowledgeTitle() {
  const knowledge = useKnowledge();
  const [title, setTitle] = useState(knowledge.title ?? "");
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex max-w-7xl items-center border-b border-divider p-6">
      {isEditing ? (
        <TitleUpdateForm
          id={knowledge.id}
          title={title}
          onCancel={() => setIsEditing(false)}
          onSubmitted={(newTitle) => {
            setTitle(newTitle);
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="flex w-full flex-row justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>

          {session?.userId === knowledge.User?.id && (
            <Button
              variant="bordered"
              size="sm"
              onPress={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
