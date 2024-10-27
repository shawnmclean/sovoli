import { KnowledgeSubmenu } from "../submenu/KnowledgeSubmenu";

export interface KnowledgeLayoutProps {
  username: string;
  slug: string;
  children: React.ReactNode;
}

export const KnowledgeLayout = ({
  children,
  slug,
  username,
}: KnowledgeLayoutProps) => {
  return (
    <main className="flex-1">
      <div className="flex w-full flex-col">
        <KnowledgeSubmenu username={username} slug={slug} />
      </div>
      <div className="mx-auto flex max-w-6xl justify-center py-5">
        {children}
      </div>
    </main>
  );
};
