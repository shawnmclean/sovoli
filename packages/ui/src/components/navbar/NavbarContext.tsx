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
      }}
    >
      <BreadcrumbItem href={`/${user?.username}`}>{user?.name}</BreadcrumbItem>
      {knowledge && (
        <BreadcrumbItem
          href={`/${user?.username}/${knowledge.slug}`}
          isCurrent={false}
        >
          {knowledge.title}
        </BreadcrumbItem>
      )}
    </Breadcrumbs>
  );
};
