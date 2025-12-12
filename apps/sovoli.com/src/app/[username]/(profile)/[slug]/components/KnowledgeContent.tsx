"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface KnowledgeContentProps {
	content: string | null;
}

export function KnowledgeContent({ content }: KnowledgeContentProps) {
	return (
		<article className="prose prose-lg max-w-none dark:prose-invert">
			<Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
		</article>
	);
}
