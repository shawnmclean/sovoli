"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { useState } from "react";
import { Chip } from "@sovoli/ui/components/chip";
// import { Button } from "../ui/button";
import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import { LibraryBigIcon, MessageSquareIcon } from "lucide-react";

import { ReferenceList } from "./ReferenceList";

export interface ConnectionsProps {
  knowledge: SelectKnowledgeSchema;
}
export function Connections({ knowledge }: ConnectionsProps) {
  const [selectedKey, setSelectedKey] = useState<string>(
    knowledge.type === "shelf" || knowledge.type === "collection"
      ? "references"
      : "replies",
  );

  return (
    <Tabs
      aria-label="Comment Options"
      color="primary"
      variant="bordered"
      fullWidth
      selectedKey={selectedKey}
      onSelectionChange={(key) => setSelectedKey(key as string)}
    >
      <Tab
        key="replies"
        title={
          <div className="flex items-center space-x-2">
            <MessageSquareIcon />
            <span>Replies</span>
            <Chip size="sm" variant="solid">
              0
            </Chip>
          </div>
        }
      >
        Comments here
      </Tab>
      <Tab
        key="references"
        title={
          <div className="flex items-center space-x-2">
            <LibraryBigIcon />
            <span>References</span>
            <Chip size="sm" variant="solid">
              {knowledge.SourceConnections?.filter(
                (c) => c.type !== "main_reference" && c.type !== "comment",
              ).length ?? 0}
            </Chip>
          </div>
        }
      >
        <ReferenceList
          knowledgeConnections={
            knowledge.SourceConnections?.filter(
              (c) => c.type !== "main_reference" && c.type !== "comment",
            ) ?? []
          }
        />
      </Tab>
    </Tabs>
  );
}
