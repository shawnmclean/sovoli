"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";
import { useSession } from "next-auth/react";

import { useKnowledge } from "../../context/KnowledgeContext";

export function KnowledgeTitle() {
  const knowledge = useKnowledge();
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);

  console.log("rendering title");

  return (
    <div className="flex max-w-7xl items-center border-b border-divider p-6">
      {isEditing ? (
        <Form className="align-center flex w-full flex-row items-center justify-between">
          <Input
            variant="bordered"
            placeholder="Title"
            classNames={{
              input: "text-2xl font-bold",
            }}
            value={knowledge.title ?? ""}
          />
          <div className="flex gap-2">
            <Button variant="solid" onPress={() => setIsEditing(true)}>
              Save
            </Button>
            <Button variant="bordered" onPress={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <div className="flex w-full flex-row justify-between">
          <h1 className="text-2xl font-bold">{knowledge.title}</h1>

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
