"use client";

import type { Session } from "@sovoli/auth";
import NextLink from "next/link";
import { Avatar } from "@nextui-org/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/ui/dropdown";

export interface NavbarRightProfileProps {
  session: Session;
}

export function NavbarRightProfile({ session }: NavbarRightProfileProps) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={session.user?.name ?? "Anonymous"}
          size="sm"
          src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem
          as={NextLink}
          key="profile"
          className="h-14 gap-2"
          href={`/${session.user?.username}`}
        >
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{session.user?.email}</p>
        </DropdownItem>
        <DropdownItem key="settings" href="/settings" as={NextLink}>
          My Settings
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
