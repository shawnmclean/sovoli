import { KnowledgeLayout } from "@sovoli/ui/components/layouts/KnowledgeLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <KnowledgeLayout>{children}</KnowledgeLayout>;
}
