"use client";

import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Link } from "@sovoli/ui/components/link";
import { LockIcon, RocketIcon } from "lucide-react";

// -------------------
// Types
// -------------------

interface NavNode {
  title: string;
  href?: string;
  icon?: LucideIcon;
  items?: NavNode[];
}

interface SidebarItemProps {
  node: NavNode;
  pathname: string;
  depth?: number;
}

// -------------------
// Navigation Tree
// -------------------

const navigation: NavNode[] = [
  {
    title: "Getting Started",
    icon: RocketIcon,
    items: [{ title: "Introduction", href: "/docs/" }],
  },
  {
    title: "Internal Docs",
    icon: LockIcon,
    href: "/docs/internal",
    items: [
      {
        title: "Onboarding",
        href: "/docs/internal/onboarding",
        items: [
          { title: "Email Setup", href: "/docs/internal/onboarding/email" },
          {
            title: "Google Business Setup",
            href: "/docs/internal/onboarding/google-business",
          },
          {
            title: "Apple Business Setup",
            href: "/docs/internal/onboarding/apple-business",
          },
          {
            title: "Bing Business Setup",
            href: "/docs/internal/onboarding/bing-business",
          },
        ],
      },
    ],
  },
];

// -------------------
// Recursive SidebarItem
// -------------------

function SidebarItem({ node, pathname, depth = 0 }: SidebarItemProps) {
  const isActive = node.href === pathname;
  const isExpandable = !!node.items?.length;
  const isExpanded = node.href && pathname.startsWith(node.href);

  if (!isExpandable) {
    return (
      <Link
        href={node.href ?? "#"}
        color="foreground"
        className="flex items-center gap-2 py-1.5 text-sm"
        underline={isActive ? "always" : "hover"}
      >
        {depth === 0 && node.icon && <node.icon className="h-4 w-4" />}
        {node.title}
      </Link>
    );
  }

  return (
    <Accordion
      defaultSelectedKeys={isExpanded ? [node.title] : []}
      className="w-full px-0"
      showDivider={false}
      isCompact
    >
      <AccordionItem
        key={node.title}
        textValue={node.title}
        classNames={{
          title: "text-sm",
          content: "pl-4",
        }}
        title={
          node.href ? (
            <Link
              href={node.href}
              color="foreground"
              className="flex items-center gap-2 text-sm"
              underline={isActive ? "always" : "hover"}
            >
              {depth === 0 && node.icon && <node.icon className="h-4 w-4" />}
              {node.title}
            </Link>
          ) : (
            <span
              className={`flex items-center gap-2 ${isActive ? "font-medium text-primary" : ""}`}
            >
              {depth === 0 && node.icon && <node.icon className="h-4 w-4" />}
              {node.title}
            </span>
          )
        }
      >
        <div className="mt-1 flex flex-col gap-1">
          {node.items?.map((child) => (
            <SidebarItem
              key={child.href ?? child.title}
              node={child}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  );
}

// -------------------
// Main Sidebar
// -------------------

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[3.75rem] z-40 h-[calc(100vh-3.75rem)] w-64 overflow-y-auto border-r border-default-200 bg-background sm:sticky sm:z-0">
      <div className="flex flex-col gap-2 p-4">
        {navigation.map((node) => (
          <SidebarItem
            key={node.title}
            node={node}
            pathname={pathname}
            depth={0}
          />
        ))}
      </div>
    </aside>
  );
}
