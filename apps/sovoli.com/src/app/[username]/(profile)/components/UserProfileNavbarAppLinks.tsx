"use client";

import { NavbarAppLinks } from "~/components/navbar/NavbarAppLinks";
import { useUserProfile } from "../../providers/UserProfileProvider";

export const UserProfileNavbarAppLinks = () => {
  const user = useUserProfile();

  return (
    <NavbarAppLinks
      items={[{ href: `/${user.username}`, name: user.name ?? user.username }]}
    />
  );
};
