import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import type { JSONContent } from "@tiptap/core";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { generateHTML } from "~/components/Editor/generateHTML";

export interface Props {
  knowledge: SelectKnowledgeSchema;
}
export function KnowledgeContent({ knowledge }: Props) {
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
}

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
