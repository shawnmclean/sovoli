"use client";

import {
  BreadcrumbItem,
  Breadcrumbs,
} from "@sovoli/ui/components/ui/breadcrumbs";

import { useUserProfile } from "../../providers/UserProfileProvider";

export const UserProfileNavbarAppLinks = () => {
  const user = useUserProfile();

  return (
    <Breadcrumbs
      separator="/"
      itemClasses={{
        separator: "px-2",
        base: "min-w-0",
      }}
    >
      <BreadcrumbItem href={`/${user.username}`}>
        <span className="overflow-hidden text-ellipsis">{user.name}</span>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
};
