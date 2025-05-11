"use client";

import { useState } from "react";
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
import { AppleIcon, ChevronDownIcon, UserIcon } from "lucide-react";
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

const menuItems = [
  "About",
  "Blog",
  "Customers",
  "Pricing",
  "Enterprise",
  "Changelog",
  "Documentation",
  "Contact Us",
];

export function TenantNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <NavbarItem
          isActive
          className="data-[active='true']:font-medium[date-active='true']"
        >
          <Link
            aria-current="page"
            className="text-default-foreground"
            href="#"
            size="sm"
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-default-500" href="#" size="sm">
            About
          </Link>
        </NavbarItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="bg-transparent p-0 text-default-500 data-[hover=true]:bg-transparent"
                endContent={<ChevronDownIcon width={16} />}
                radius="sm"
                variant="light"
              >
                Admissions
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Admissions links" className="w-[200px]">
            <DropdownItem key="requirements" href="#requirements">
              Admission Requirements
            </DropdownItem>
            <DropdownItem key="tuition" href="#tuition">
              Tuition and Fees
            </DropdownItem>
            <DropdownItem key="apply" href="#apply">
              How to Apply
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="bg-transparent p-0 text-default-500 data-[hover=true]:bg-transparent"
                endContent={<ChevronDownIcon width={16} />}
                radius="sm"
                variant="light"
              >
                Academics
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Academics links" className="w-[200px]">
            <DropdownItem key="programs" href="#programs">
              Programs
            </DropdownItem>
            <DropdownItem key="faculty" href="#faculty">
              Faculty List
            </DropdownItem>
            <DropdownItem key="curriculum" href="#curriculum">
              Curriculum
            </DropdownItem>
            <DropdownItem key="calendar" href="#calendar">
              Academic Calendar
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <NavbarItem>
          <Link className="text-default-500" href="#" size="sm">
            Contact
          </Link>
        </NavbarItem>
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
            <Button
              className="text-default-500"
              variant="light"
              onPress={() => setIsLoggedIn(true)}
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenuToggle className="text-default-400 md:hidden" />

      <NavbarMenu
        className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        motionProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: {
            ease: "easeInOut",
            duration: 0.2,
          },
        }}
      >
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
        <NavbarMenuItem className="mb-4">
          <Button
            fullWidth
            as={Link}
            className="bg-foreground text-background"
            href="/#"
          >
            Apply Now
          </Button>
        </NavbarMenuItem>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="mb-2 w-full text-default-500" href="#" size="md">
              {item}
            </Link>
            {index < menuItems.length - 1 && <Divider className="opacity-50" />}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
