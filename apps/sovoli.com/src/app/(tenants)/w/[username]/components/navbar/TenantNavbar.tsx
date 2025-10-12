"use client";

import { useState } from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Link } from "@sovoli/ui/components/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { ChevronDownIcon } from "lucide-react";
import { tv } from "tailwind-variants";

import type { OrgInstanceWithWebsite } from "../../lib/types";
import { MobileSearchBar } from "./MobileSearchBar";

const navbarBaseStyles = tv({
  base: "border-default-100 bg-transparent",
  variants: {
    menuOpen: {
      true: "bg-default-200/50 dark:bg-default-100/50",
    },
  },
  defaultVariants: {
    menuOpen: false,
  },
});

export interface TenantNavbarProps {
  orgInstance: OrgInstanceWithWebsite;
}

export function TenantNavbar({
  orgInstance: {
    websiteModule: { website },
    org,
    academicModule,
  },
}: TenantNavbarProps) {
  const programs = academicModule?.programs;

  const navConfig = website.header?.nav ?? [];
  const actionsConfig = website.header?.actions ?? [];

  // Map nav keys to hrefs and handle dropdowns
  const navItems = navConfig
    .map((item) => {
      switch (item.key) {
        case "home":
          return { label: item.label, href: "/" };
        case "about":
          return { label: item.label, href: "/about" };
        case "academics":
          return programs?.length
            ? {
                label: item.label,
                dropdown: [
                  ...programs.slice(0, 5).map((program) => ({
                    label:
                      program.name ??
                      program.standardProgramVersion?.program.name ??
                      "",
                    href: `/programs/${program.slug}`,
                  })),
                  { label: "All Programs...", href: "/programs" },
                ],
              }
            : { label: item.label, href: "/programs" };
        case "workforce":
          return {
            label: item.label,
            dropdown: [
              { label: "Our Team", href: "/workforce/people" },
              { label: "Open Positions", href: "/workforce/positions" },
            ],
          };
        case "offerings":
          return { label: item.label, href: "/services" };
        case "contact":
          return { label: item.label, href: "/contact" };
        default:
          return { label: item.label, href: "#" };
      }
    })
    .filter(Boolean);

  // Map actions keys to hrefs
  const actionButtons = actionsConfig
    .map((action) => {
      switch (action.key) {
        case "apply":
          return {
            ...action,
            href: "/programs",
            color: "secondary",
            variant: "flat",
          };
        case "contact":
          return {
            ...action,
            href: "/contact",
            color: "primary",
            variant: "flat",
          };
        case "schedule":
          return {
            ...action,
            href: "/schedule",
            color: "primary",
            variant: "flat",
          };
        default:
          return {
            ...action,
            href: "#",
            color: "primary",
            variant: "flat",
          };
      }
    })
    .filter(Boolean);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Navbar
        maxWidth="xl"
        classNames={{
          base: navbarBaseStyles({ menuOpen: isMenuOpen }),
          wrapper: "w-full justify-center",
          item: "hidden md:flex",
        }}
        height="60px"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand className="hidden md:flex">
          <Link href="/">
            <Avatar src={org.logo} name={website.siteName} size="md" />

            <span className="ml-2 text-small font-medium text-default-foreground">
              {website.siteName}
            </span>
          </Link>
        </NavbarBrand>

        <NavbarContent justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.label}>
              {item.dropdown ? (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      disableRipple
                      className="bg-transparent p-0 text-default-500"
                      endContent={<ChevronDownIcon width={16} />}
                    >
                      {item.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu className="w-[200px]">
                    {item.dropdown.map((subItem) => (
                      <DropdownItem key={subItem.label} href={subItem.href}>
                        {subItem.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Link href={item.href} className="text-default-500">
                  {item.label}
                </Link>
              )}
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem className="ml-2 !flex gap-2">
            {actionButtons.map((btn) => (
              <Button
                key={btn.key}
                className="bg-default-foreground font-medium text-background"
                color={
                  btn.color as
                    | "default"
                    | "secondary"
                    | "primary"
                    | "success"
                    | "warning"
                    | "danger"
                    | undefined
                }
                variant={
                  btn.variant as
                    | "flat"
                    | "shadow"
                    | "solid"
                    | "bordered"
                    | "light"
                    | "faded"
                    | "ghost"
                    | undefined
                }
                as={Link}
                href={btn.href}
              >
                {btn.label}
              </Button>
            ))}
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Search Bar */}
        <MobileSearchBar />
      </Navbar>
    </>
  );
}
