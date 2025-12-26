"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { Link } from "@sovoli/ui/components/link";
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Button } from "@sovoli/ui/components/button";
import { Logo } from "~/components/Logo/Logo";
import { usePathname, useRouter } from "next/navigation";
import { MenuIcon, ChevronLeftIcon } from "lucide-react";

const menuItems = [
  {
    key: "getting-started",
    name: "Getting Started",
    href: "/docs",
  },
  {
    key: "guides",
    name: "Guides",
    href: "/docs/guides",
  },
];

export function DocsNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (pathname) {
      startTransition(() => {
        setIsDrawerOpen(false);
      });
    }
  }, [pathname]);

  const showBackButton = pathname?.startsWith("/docs/guides") ?? false;

  if (showBackButton) {
    return (
      <Navbar
        maxWidth="xl"
        className="bg-background/80 backdrop-blur-md"
        height="60px"
        position="static"
        isBordered
      >
        <NavbarContent>
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              radius="full"
              aria-label="Go back"
              onPress={() => router.push("/docs")}
            >
              <ChevronLeftIcon size={24} />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  }

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
            <Link href="/docs" className="flex items-center gap-2">
              <Logo />
              <span className="font-semibold">Docs</span>
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
              <Link href="/docs" className="flex items-center gap-2">
                <Logo />
                <span className="font-semibold">Docs</span>
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
