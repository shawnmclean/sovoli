import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

export interface Props {
  knowledge: SelectKnowledgeSchema;
}
export function KnowledgeContent({ knowledge }: Props) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <Text className="my-2">{children}</Text>,
        h1: ({ children }) => (
          <Heading className="my-3" size="3xl">
            {children}
          </Heading>
        ),
        h2: ({ children }) => (
          <Heading className="my-3" size="2xl">
            {children}
          </Heading>
        ),
        h3: ({ children }) => (
          <Heading className="my-2" size="xl">
            {children}
          </Heading>
        ),
        h4: ({ children }) => (
          <Heading className="my-2" size="lg">
            {children}
          </Heading>
        ),
        h5: ({ children }) => (
          <Heading className="my-2" size="md">
            {children}
          </Heading>
        ),
        h6: ({ children }) => (
          <Heading className="my-2" size="sm">
            {children}
          </Heading>
        ),
      }}
    >
      {knowledge.content}
    </Markdown>
  );
}
