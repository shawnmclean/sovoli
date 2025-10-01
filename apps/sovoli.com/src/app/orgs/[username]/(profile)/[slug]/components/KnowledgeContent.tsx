"use client";

import type { JSONContent } from "@tiptap/core";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateHTML } from "~/components/Editor/generateHTML";

interface KnowledgeContentProps {
  content: string | null;
}

export function KnowledgeContent({ content }: KnowledgeContentProps) {
  if (content?.startsWith("{")) {
    const contentHTML = getContent(content);

    return (
      <article
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      />
    );
  } else {
    return (
      <article className="prose prose-lg max-w-none dark:prose-invert">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </article>
    );
  }
}

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
