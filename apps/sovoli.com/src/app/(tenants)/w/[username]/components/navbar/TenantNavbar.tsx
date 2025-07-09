"use client";

import { useState } from "react";
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
} from "@sovoli/ui/components/navbar";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { Input } from "@sovoli/ui/components/input";
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        <div className="md:hidden flex-1">
          <Button
            variant="bordered"
            fullWidth
            className="w-full justify-start text-default-400 bg-default-100"
            onPress={onOpen}
            startContent={<SearchIcon width={16} />}
          >
            What program fits your child?
          </Button>
        </div>
      </Navbar>

      {/* Search Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="top"
        backdrop="opaque"
        hideCloseButton
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          <DrawerHeader className="border-b-1 border-default-200">
            <div className="flex items-center gap-2 w-full">
              <Input
                fullWidth
                placeholder="Search for programs, courses, or schools..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                variant="bordered"
                size="lg"
                className="flex-1"
                autoFocus
                startContent={<SearchIcon width={16} />}
              />
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onOpenChange}
                className="flex-shrink-0"
              >
                <XIcon width={20} />
              </Button>
            </div>
          </DrawerHeader>
          <DrawerBody>
            <div className="space-y-4">
              {searchQuery ? (
                <div className="text-center text-default-500">
                  <p>Search results for "{searchQuery}"</p>
                  <p className="text-sm mt-2">
                    Search functionality coming soon...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Popular Programs</h3>
                    <div className="space-y-2">
                      {programs?.slice(0, 4).map((program) => (
                        <Button
                          key={program.slug}
                          as={Link}
                          href={`/programs/${program.slug}`}
                          variant="light"
                          className="w-full justify-start"
                          onPress={onOpenChange}
                        >
                          {program.name ??
                            program.standardProgramVersion?.program.name ??
                            ""}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <h3 className="font-semibold mb-2">Quick Links</h3>
                    <div className="space-y-2">
                      <Button
                        as={Link}
                        href="/programs"
                        variant="light"
                        className="w-full justify-start"
                        onPress={onOpenChange}
                      >
                        All Programs
                      </Button>
                      <Button
                        as={Link}
                        href="/contact"
                        variant="light"
                        className="w-full justify-start"
                        onPress={onOpenChange}
                      >
                        Contact Us
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
