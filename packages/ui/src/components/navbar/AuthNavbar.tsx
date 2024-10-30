"use client";

import type { Session } from "@sovoli/auth";
import NextLink from "next/link";
import { Avatar } from "@nextui-org/avatar";
import { signOut } from "next-auth/react";

import { Chip } from "../ui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../ui/dropdown";
import { Link } from "../ui/link";
import {
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "../ui/navbar";

export interface AuthNavbarProps {
  session: Session;
  NavbarContextComponent: React.ReactNode;
}

export function AuthNavbar({
  session,
  NavbarContextComponent,
}: AuthNavbarProps) {
  return (
    <NextUINavbar maxWidth="full">
      <NavbarContent justify="start" className="min-w-0">
        <Link href="/" color="foreground" className="shrink-0">
          {/* Logo Image here */}
          <p className="whitespace-nowrap font-bold text-inherit">Sovoli</p>
        </Link>
        <NavbarItem className="overflow-hidden">
          {NavbarContextComponent}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Chip color="warning" variant="dot">
            Reworking Design System
          </Chip>
        </NavbarItem>
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={session.user?.name ?? "Anonymous"}
                size="sm"
                src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp?t=2024-10-26T02%3A43%3A35.093Z"
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
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => signOut()}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}
