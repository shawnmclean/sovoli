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
      <main>
        <div className="flex w-full flex-col">
          <KnowledgeSubmenu
            username={knowledge.User.username ?? ""}
            slug={knowledge.slug ?? ""}
          />
        </div>
        {children}
      </main>
    </div>
  );
};
