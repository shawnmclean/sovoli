import { permanentRedirect } from "next/navigation";
import { KnowledgeLayout } from "@sovoli/ui/components/layouts/KnowledgeLayout";

import { preload, retreiveKnowledgeBySlug } from "./lib/getKnowledge";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
}
export default async function Layout({ children, params }: Props) {
  const { username, slug } = await params;

  // temp hack since I no longer have a chatgpt account and using my account instead (migrated data)
  if (username.toLowerCase() === "chatgpt") {
    return permanentRedirect("/shawn/" + slug);
  }

  preload({
    params: { slug, username },
    searchParams: { page: 1, pageSize: 30 },
  });

  const { knowledge } = await retreiveKnowledgeBySlug({
    params: { slug, username },
    searchParams: { page: 1, pageSize: 30 },
  });

  return <KnowledgeLayout knowledge={knowledge}>{children}</KnowledgeLayout>;
}
