"use client";

import { signIn } from "next-auth/react";

import { Button } from "../ui/button";
import { Chip } from "../ui/chip";
// using link here because of nextjs full refresh issue and nextui link styles hard to override: https://github.com/nextui-org/nextui/issues/3786
import { Link } from "../ui/link";
import {
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "../ui/navbar";

export interface UnauthNavbarProps {
  NavbarContextComponent: React.ReactNode;
}

export function UnauthNavbar({ NavbarContextComponent }: UnauthNavbarProps) {
  return (
    <NextUINavbar maxWidth="full">
      <NavbarContent>
        <Link href="/" color="foreground">
          {/* Logo Image here */}
          <p className="font-bold text-inherit">Sovoli</p>
        </Link>
        {NavbarContextComponent}
      </NavbarContent>
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
        <NavbarItem>
          <Button color="primary" onClick={() => signIn()}>
            Sign In
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}
