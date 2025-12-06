"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@sovoli/ui/components/dropdown";
import { Button } from "@sovoli/ui/components/button";
import {
  GraduationCapIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  TreesIcon,
  UsersIcon,
  CircleEllipsisIcon,
  ChevronDownIcon,
} from "lucide-react";

const sectors = [
  {
    key: "education",
    name: "Education",
    href: "/education",
    icon: GraduationCapIcon,
  },
  {
    key: "services",
    name: "Services",
    href: "/services",
    icon: BriefcaseIcon,
  },
  {
    key: "retail",
    name: "Retail",
    href: "/retail",
    icon: ShoppingBagIcon,
  },
  {
    key: "farming",
    name: "Farms & Agriculture",
    href: "/farming",
    icon: TreesIcon,
  },
  {
    key: "community",
    name: "Community & NGOs",
    href: "/community",
    icon: UsersIcon,
  },
  {
    key: "other",
    name: "Other",
    href: "/other",
    icon: CircleEllipsisIcon,
  },
];

export function BusinessSubnav() {
  const pathname = usePathname();

  // Find current sector based on pathname
  const currentSector = sectors.find((s) => pathname?.startsWith(s.href));

  return (
    <div className="border-b border-default-200 bg-content1/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/business"
              className={`text-sm font-medium transition-colors ${
                pathname === "/business"
                  ? "text-primary"
                  : "text-default-600 hover:text-foreground"
              }`}
            >
              Sovoli Business
            </Link>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  className="gap-1 text-default-600"
                  endContent={<ChevronDownIcon className="h-4 w-4" />}
                >
                  {currentSector ? currentSector.name : "Sectors"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Sectors" items={sectors}>
                {(sector) => (
                  <DropdownItem
                    key={sector.key}
                    href={sector.href}
                    startContent={<sector.icon className="h-4 w-4" />}
                    className={pathname === sector.href ? "text-primary" : ""}
                  >
                    {sector.name}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          <Link
            href="/signup/business"
            className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

