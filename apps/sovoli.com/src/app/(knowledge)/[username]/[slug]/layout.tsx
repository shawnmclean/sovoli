import { KnowledgeLayout } from "@sovoli/ui/components/layouts/KnowledgeLayout";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
}
export default async function Layout({ children, params }: Props) {
  const { username, slug } = await params;
  return (
    <KnowledgeLayout username={username} slug={slug}>
      {children}
    </KnowledgeLayout>
  );
}
