"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import {
  BreadcrumbItem,
  Breadcrumbs,
} from "@sovoli/ui/components/ui/breadcrumbs";

import { useUserProfile } from "../../../providers/UserProfileProvider";

export interface KnowledgeNavbarAppLinksProps {
  knowledge: SelectKnowledgeSchema;
}
export const KnowledgeNavbarAppLinks = ({
  knowledge,
}: KnowledgeNavbarAppLinksProps) => {
  const user = useUserProfile();
  return (
    <Breadcrumbs
      separator="/"
      itemClasses={{
        separator: "px-2",
        item: "text-muted-foreground",
        base: "min-w-0",
      }}
    >
      <BreadcrumbItem href={`/${user.username}`} isCurrent={false}>
        <span className="overflow-hidden text-ellipsis">{user.name}</span>
      </BreadcrumbItem>
      <BreadcrumbItem
        href={`/${user.username}/${knowledge.slug}`}
        isCurrent={false}
      >
        <span className="overflow-hidden text-ellipsis">{knowledge.title}</span>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
};
