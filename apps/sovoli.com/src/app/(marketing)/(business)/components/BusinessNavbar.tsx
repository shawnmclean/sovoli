"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Link } from "@sovoli/ui/components/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Logo } from "~/components/Logo/Logo";
import {
  BUSINESS_CATEGORIES,
  businessCategoryHref,
} from "../business/categories";

const menuItems = [
  {
    key: "overview",
    name: "Overview",
    href: "/business",
  },
  ...BUSINESS_CATEGORIES.map((category) => ({
    key: category.id,
    name: category.label,
    href: businessCategoryHref(category.id),
  })),
];

export function BusinessNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (pathname) {
      startTransition(() => {
        setIsDrawerOpen(false);
      });
    }
  }, [pathname]);

  return (
    <>
      <Navbar
        maxWidth="xl"
        className="bg-background/80 backdrop-blur-md"
        height="60px"
        position="static"
        isBordered
      >
        <NavbarContent>
          <NavbarBrand>
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.key}>
              <Link
                color={pathname === item.href ? "primary" : "foreground"}
                href={item.href}
                className="w-full"
                size="sm"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              radius="full"
              aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
              onPress={() => setIsDrawerOpen(true)}
            >
              <MenuIcon size={24} />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <Drawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        placement="right"
        size="xs"
        hideCloseButton
      >
        <DrawerContent>
          <DrawerHeader
            startContent={
              <Link href="/business" className="flex items-center">
                <Logo />
              </Link>
            }
            showBackButton
            onBackPress={() => setIsDrawerOpen(false)}
          />
          <DrawerBody className="px-4 py-2">
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  color={pathname === item.href ? "primary" : "foreground"}
                  className={`w-full px-4 py-3 rounded-lg hover:bg-default-100 transition-colors text-lg ${
                    pathname === item.href ? "bg-primary/10" : ""
                  }`}
                  size="lg"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
