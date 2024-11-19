import { KnowledgeLayout } from "@sovoli/ui/components/layouts/KnowledgeLayout";

import { preload, retreiveKnowledgeBySlug } from "./lib/getKnowledge";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
}
export default async function Layout({ children, params }: Props) {
  const { username, slug } = await params;

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
