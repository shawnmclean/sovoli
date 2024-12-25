"use client";

import { NavbarAppLinks } from "~/components/navbar/NavbarAppLinks";
import { useUserProfile } from "../../context/UserProfileContext";

export const UserProfileNavbarAppLinks = () => {
  const user = useUserProfile();

  return (
    <NavbarAppLinks
      items={[{ href: `/${user.username}`, name: user.name ?? user.username }]}
    />
  );
};
