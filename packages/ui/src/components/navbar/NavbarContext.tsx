"use client";

import type {
  SelectKnowledgeSchema,
  SelectUserSchema,
} from "@sovoli/db/schema";

import { BreadcrumbItem, Breadcrumbs } from "../ui/breadcrumbs";

export interface NavbarContextProps {
  user?: SelectUserSchema;
  knowledge?: SelectKnowledgeSchema;
}
export const NavbarContext = ({ user, knowledge }: NavbarContextProps) => {
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
