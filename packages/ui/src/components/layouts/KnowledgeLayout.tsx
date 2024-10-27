import { KnowledgeSubmenu } from "../submenu/KnowledgeSubmenu";

export const KnowledgeLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="flex-1">
      <div className="flex w-full flex-col">
        <KnowledgeSubmenu />
      </div>
      <div className="mx-auto flex max-w-6xl justify-center py-5">
        {children}
      </div>
    </main>
  );
};
