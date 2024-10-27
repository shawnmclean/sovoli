"use client";

import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { signIn } from "next-auth/react";

import { Button } from "../ui/button";
import { Chip } from "../ui/chip";
import { Link } from "../ui/link";

export function UnauthNavbar() {
  return (
    <NextUINavbar maxWidth="full">
      <NavbarBrand>
        <Link href="/" color="foreground">
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
        <NavbarItem>
          <Button color="primary" variant="flat" onClick={() => signIn()}>
            Sign In
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}
