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
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Logo } from "~/components/Logo/Logo";

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

interface DocsNavbarProps {
  title?: string;
}

export function DocsNavbar({ title }: DocsNavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (pathname) {
      startTransition(() => {
        setIsDrawerOpen(false);
      });
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      // Check multiple scroll sources
      const windowScrollY = window.scrollY;
      const documentScrollTop = document.documentElement.scrollTop;
      const mainElement = document.querySelector("main");
      const mainScrollTop = mainElement?.scrollTop ?? 0;

      // Use the maximum scroll value
      const scrollY = Math.max(windowScrollY, documentScrollTop, mainScrollTop);
      const scrolled = scrollY > 50;

      setIsScrolled(scrolled);
    };

    // Initial check
    handleScroll();

    // Listen to scroll on window, document, and main element
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      const mainEl = document.querySelector("main");
      if (mainEl) {
        mainEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Calculate parent path by removing the last segment
  // e.g., /docs/guides/whatsapp/new-business -> /docs/guides/whatsapp
  //      /docs/guides/whatsapp -> /docs/guides
  //      /docs/guides -> /docs
  const getParentPath = (currentPath: string | null): string | null => {
    if (!currentPath || currentPath === "/docs") {
      return null;
    }
    const segments = currentPath.split("/").filter(Boolean);
    if (segments.length <= 2) {
      // At /docs or /docs/something, parent is /docs
      return "/docs";
    }
    // Remove the last segment
    segments.pop();
    return `/${segments.join("/")}`;
  };

  const parentPath = getParentPath(pathname);
  const showBackButton = parentPath !== null && pathname !== "/docs";

  if (showBackButton) {
    return (
      <Navbar
        maxWidth="xl"
        position="sticky"
        className="h-[72px]"
        classNames={{ wrapper: "px-0" }}
      >
        <NavbarContent className="min-w-0">
          <NavbarItem className="flex-shrink-0">
            <Button
              isIconOnly
              variant="light"
              radius="full"
              aria-label="Go back"
              as={NextLink}
              href={parentPath}
            >
              <ChevronLeftIcon size={24} />
            </Button>
          </NavbarItem>
          {title && isScrolled && (
            <NavbarItem className="text-lg font-semibold whitespace-normal min-w-0 flex-1 overflow-hidden">
              {title}
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
    );
  }

  return (
    <>
      <Navbar
        maxWidth="xl"
        className="bg-background/80 backdrop-blur-md"
        position="sticky"
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
