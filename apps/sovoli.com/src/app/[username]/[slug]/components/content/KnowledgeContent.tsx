"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import type { JSONContent } from "@tiptap/core";
import { Button } from "@sovoli/ui/components/button";
import { Edit2Icon, EyeIcon, MessageSquareIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { generateHTML } from "~/components/Editor/generateHTML";
import { useKnowledge } from "../../context/KnowledgeContext";

export function KnowledgeContent() {
  const knowledge = useKnowledge();

  return (
    <div className="w-full">
      <div className="mb-6 flex w-full items-center justify-between border-b border-divider pb-4">
        <div className="flex items-center gap-1">
          <Button
            variant="light"
            size="sm"
            className="text-default-400"
            startContent={<MessageSquareIcon className="h-5 w-5" />}
            title="Lies, nobody reads this."
          >
            4
          </Button>
          <Button
            variant="light"
            size="sm"
            className="text-default-400"
            startContent={<EyeIcon className="h-5 w-5" />}
            title="I wish, will replace with real number when I figure out how to log views LOL."
          >
            1.1k
          </Button>
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="text-default-400"
        >
          <Edit2Icon className="h-5 w-5" />
        </Button>
      </div>
      <section>
        <p className="text-gray-400">{knowledge.description}</p>
      </section>
      <section>
        <Content knowledge={knowledge} />
      </section>
    </div>
  );
}

const Content = ({ knowledge }: { knowledge: SelectKnowledgeSchema }) => {
  if (knowledge.content?.startsWith("{")) {
    const contentHTML = getContent(knowledge);

    return (
      <article
        className="g prose max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      />
    );
  } else {
    return (
      <article className="g prose max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>{knowledge.content}</Markdown>
      </article>
    );
  }
};

const getContent = (knowledge: SelectKnowledgeSchema) => {
  if (!knowledge.content) return "Nothing to see here";
  try {
    const jsonContent = JSON.parse(knowledge.content) as JSONContent;
    return generateHTML(jsonContent);
  } catch (error) {
    console.error("Invalid JSON content provided to the editor:", error);
    return "Invalid JSON content";
  }
};
