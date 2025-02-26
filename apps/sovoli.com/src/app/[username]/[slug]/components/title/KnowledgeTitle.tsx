"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Edit2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

import { useKnowledge } from "../../context/KnowledgeContext";
import { TitleUpdateForm } from "./TitleUpdateForm";

export function KnowledgeTitle() {
  const knowledge = useKnowledge();
  const [title, setTitle] = useState(knowledge.title ?? "");
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center px-6 py-2">
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
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
          <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>

          {session?.userId === knowledge.User?.id && (
            <Button
              isIconOnly
              variant="light"
              className="text-default-400"
              onPress={() => setIsEditing(true)}
            >
              <Edit2Icon className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
