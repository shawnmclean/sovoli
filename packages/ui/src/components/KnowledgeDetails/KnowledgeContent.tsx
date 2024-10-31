import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Props {
  knowledge: SelectKnowledgeSchema;
}
export function KnowledgeContent({ knowledge }: Props) {
  return (
    <article className="g prose max-w-none">
      <Markdown remarkPlugins={[remarkGfm]}>{knowledge.content}</Markdown>
    </article>
  );
}
