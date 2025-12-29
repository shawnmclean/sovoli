"use client";

import Markdown from "react-markdown";

interface KnowledgeContentProps {
  content: string | null;
}

export function KnowledgeContent({ content }: KnowledgeContentProps) {
  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      <Markdown>{content}</Markdown>
    </article>
  );
}
