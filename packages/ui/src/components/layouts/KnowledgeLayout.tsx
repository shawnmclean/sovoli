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
      {children}
    </main>
  );
};
