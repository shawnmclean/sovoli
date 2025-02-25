"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

import { NavbarAppLinks } from "~/components/navbar/NavbarAppLinks";
import { useUserProfile } from "../../context/UserProfileContext";

export interface KnowledgeNavbarAppLinksProps {
  knowledge: SelectKnowledgeSchema;
}
export const KnowledgeNavbarAppLinks = ({
  knowledge,
}: KnowledgeNavbarAppLinksProps) => {
  const user = useUserProfile();
  return (
    <NavbarAppLinks
      items={[
        { href: `/${user.username}`, name: user.name ?? user.username },
        {
          href: `/${user.username}/${knowledge.slug}`,
          name: knowledge.type,
        },
      ]}
    />
  );
};
