import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { Navbar } from "@sovoli/ui/components/navbar";

import { KnowledgeNavbarAppLinks } from "./KnowledgeNavbarAppLinks";
import { KnowledgeSubmenu } from "./KnowledgeSubmenu";

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
      <Navbar AppLinks={<KnowledgeNavbarAppLinks knowledge={knowledge} />} />
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
