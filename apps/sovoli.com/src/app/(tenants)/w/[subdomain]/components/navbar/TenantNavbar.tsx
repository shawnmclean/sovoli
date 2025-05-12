"use client";

import { useState } from "react";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
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
import { AppleIcon, ChevronDownIcon } from "lucide-react";
import { tv } from "tailwind-variants";

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

const navItems = [
  { label: "Home", href: "/#" },
  { label: "About", href: "/about" },
  {
    label: "Admissions",
    dropdown: [
      { label: "Requirements", href: "#requirements" },
      { label: "Fees", href: "/admissions/fees" },
      { label: "Apply", href: "#apply" },
    ],
  },
  {
    label: "Academics",
    dropdown: [
      { label: "Programs", href: "#programs" },
      { label: "Faculty", href: "#faculty" },
      { label: "Curriculum", href: "#curriculum" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function TenantNavbar() {
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
        <div className="rounded-full bg-default-foreground text-background">
          <AppleIcon size={34} />
        </div>
        <span className="ml-2 text-small font-medium text-default-foreground">
          Modern Academy
        </span>
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
          <Button
            className="bg-default-foreground font-medium text-background"
            color="secondary"
            variant="flat"
          >
            Apply Now
          </Button>
          {isLoggedIn ? (
            <Button variant="light" onClick={() => setIsLoggedIn(false)}>
              Logout
            </Button>
          ) : (
            <Button variant="light" onClick={() => setIsLoggedIn(true)}>
              Login
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
            href="/#"
            variant="faded"
            onPress={() => setIsLoggedIn(true)}
          >
            Sign In
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            fullWidth
            as={Link}
            className="bg-foreground text-background"
            href="/#"
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
