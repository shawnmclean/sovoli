"use client";

import type { JSONContent } from "@tiptap/core";
import { Button } from "@sovoli/ui/components/button";
import { EyeIcon, MessageSquareIcon } from "lucide-react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { generateHTML } from "~/components/Editor/generateHTML";
import { useKnowledge } from "../../context/KnowledgeContext";

export function KnowledgeContent() {
  const knowledge = useKnowledge();

  return (
    <div className="w-full">
      <div className="mb-6 flex w-full items-center justify-between border-b border-divider py-2">
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
      </div>

      <section className="mb-4">
        <p className="text-gray-400">{knowledge.description}</p>
      </section>
      <section>
        <Content content={knowledge.content} />
      </section>
    </div>
  );
}

const Content = ({ content }: { content: string | null }) => {
  if (content?.startsWith("{")) {
    const contentHTML = getContent(content);

    return (
      <article
        className="g prose max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      />
    );
  } else {
    return (
      <article className="g prose max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </article>
    );
  }
};

const getContent = (content: string | null) => {
  if (!content) return "Nothing to see here";
  try {
    const jsonContent = JSON.parse(content) as JSONContent;
    return generateHTML(jsonContent);
  } catch (error) {
    console.error("Invalid JSON content provided to the editor:", error);
    return "Invalid JSON content";
  }
};
