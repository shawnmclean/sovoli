"use client";

import type {
  SelectKnowledgeSchema,
  SelectUserSchema,
} from "@sovoli/db/schema";

import { BreadcrumbItem, Breadcrumbs } from "../ui/breadcrumbs";

export interface NavbarAppLinksProps {
  user?: SelectUserSchema;
  knowledge?: SelectKnowledgeSchema;
}
export const NavbarAppLinks = ({ user, knowledge }: NavbarAppLinksProps) => {
  return (
    <Breadcrumbs
      separator="/"
      itemClasses={{
        separator: "px-2",
        item: "text-muted-foreground",
        base: "min-w-0",
      }}
    >
      <BreadcrumbItem href={`/${user?.username}`} isCurrent={false}>
        <span className="overflow-hidden text-ellipsis">{user?.name}</span>
      </BreadcrumbItem>
      {knowledge && (
        <BreadcrumbItem
          href={`/${user?.username}/${knowledge.slug}`}
          isCurrent={false}
        >
          <span className="overflow-hidden text-ellipsis">
            {knowledge.title}
          </span>
        </BreadcrumbItem>
      )}
    </Breadcrumbs>
  );
};
