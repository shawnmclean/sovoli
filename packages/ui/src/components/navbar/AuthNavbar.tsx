"use client";

import type { Session } from "@sovoli/auth";
import NextLink from "next/link";
import { Avatar } from "@nextui-org/avatar";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { signOut } from "next-auth/react";

import { Chip } from "../ui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../ui/dropdown";
import { Link } from "../ui/link";

export interface AuthNavbarProps {
  session: Session;
}

export function AuthNavbar({ session }: AuthNavbarProps) {
  return (
    <NextUINavbar maxWidth="full">
      <NavbarBrand>
        <Link href="/">
          {/* Logo Image here */}
          <p className="font-bold text-inherit">Sovoli</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem>
          <Chip color="warning" variant="dot">
            Reworking Design System
          </Chip>
        </NavbarItem>
        {/* <NavbarItem isActive>
            <Link href="#" aria-current="page">
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
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
            <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </NextUINavbar>
  );
}
