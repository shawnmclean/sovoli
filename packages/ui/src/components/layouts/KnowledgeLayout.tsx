import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

import { Navbar } from "../navbar";
import { KnowledgeSubmenu } from "../submenu/KnowledgeSubmenu";

export interface KnowledgeLayoutProps {
  knowledge: SelectKnowledgeSchema;
  children: React.ReactNode;
}

export const KnowledgeLayout = ({
  children,
  knowledge,
}: KnowledgeLayoutProps) => {
  if (!knowledge.User) {
    throw new Error("User not found");
  }
  return (
    <div>
      <Navbar user={knowledge.User} knowledge={knowledge} />
      <main className="flex-1">
        <div className="flex w-full flex-col">
          <KnowledgeSubmenu
            username={knowledge.User.username ?? ""}
            slug={knowledge.slug ?? ""}
          />
        </div>
        <div className="mx-auto flex max-w-7xl justify-center py-5">
          {children}
        </div>
      </main>
    </div>
  );
};
