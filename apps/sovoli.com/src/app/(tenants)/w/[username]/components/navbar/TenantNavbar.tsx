"use client";

import { useState } from "react";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { Divider } from "@sovoli/ui/components/divider";
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
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@sovoli/ui/components/navbar";
import { ChevronDownIcon, UserIcon } from "lucide-react";
import { tv } from "tailwind-variants";

import type { OrgInstanceWithWebsite } from "../../lib/types";

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
                    href: `/academics/programs/${program.slug}`,
                  })),
                  { label: "All Programs...", href: "/academics/programs" },
                ],
              }
            : { label: item.label, href: "/academics/programs" };
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
        case "gallery":
          return { label: item.label, href: "/gallery" };
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
            href: "/academics/apply",
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = () => setTimeout(() => setIsMenuOpen(false), 200);

  return (
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
      <NavbarBrand>
        <Link href="/">
          <Avatar src={org.logo} name={website.siteName} size="md" />

          <span className="ml-2 hidden text-small font-medium text-default-foreground md:inline">
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
          {isLoggedIn ? (
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="bg-transparent p-0 data-[hover=true]:bg-transparent"
                    endContent={<ChevronDownIcon width={16} />}
                    variant="light"
                  >
                    <UserIcon width={24} />
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu aria-label="User Menu" className="w-[200px]">
                <DropdownItem key="profile" href="#profile">
                  My Profile
                </DropdownItem>
                <DropdownItem key="settings" href="#settings">
                  Account Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  href="#logout"
                  onPress={() => setIsLoggedIn(false)}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button variant="light" href="/signin" as={Link}>
              Sign In
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenuToggle className="text-default-400 md:hidden" />

      <NavbarMenu className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
        <NavbarMenuItem>
          <Button
            fullWidth
            as={Link}
            href="/signin"
            variant="faded"
            onPress={handleCloseMenu}
          >
            Sign In
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            fullWidth
            as={Link}
            className="bg-foreground text-background"
            href="/academics/apply"
            onPress={handleCloseMenu}
          >
            Apply Now
          </Button>
          <Divider className="mt-4" />
        </NavbarMenuItem>
        {navItems.map((item) => (
          <NavbarMenuItem key={item.label}>
            {item.dropdown ? (
              <Accordion
                isCompact
                className="px-0"
                showDivider
                itemClasses={{
                  content: "px-2 border-l-1 border-default-500",
                  title: "text-default-500",
                }}
              >
                <AccordionItem title={item.label}>
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className="block py-2 text-default-500"
                      onPress={handleCloseMenu}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                href={item.href}
                className="block py-2 text-default-500"
                onPress={handleCloseMenu}
              >
                {item.label}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
