"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@sovoli/ui/components/navbar";
import { Button } from "@sovoli/ui/components/button";
import { Link as UILink } from "@sovoli/ui/components/link";
import { Logo } from "~/components/Logo/Logo";

const menuItems = [
  { name: "Growth System", href: "/growth-system" },
  { name: "Pricing", href: "/pricing" },
];

export function MarketingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      maxWidth="xl"
      className="bg-background/80 backdrop-blur-md"
      height="60px"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <p className="font-bold text-inherit">Sovoli</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <UILink
              color="foreground"
              href={item.href}
              className="w-full"
              size="sm"
            >
              {item.name}
            </UILink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/pricing" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <UILink
              color="foreground"
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.name}
            </UILink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
