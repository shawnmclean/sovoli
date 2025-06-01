"use client";

import type { LucideIcon } from "lucide-react";
import { RocketIcon, LockIcon } from "lucide-react";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Link } from "@sovoli/ui/components/link";
import { usePathname } from "next/navigation";

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
          { title: "Google Business Setup", href: "/docs/internal/onboarding/google-business" },
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
        className="py-1.5 flex items-center gap-2 text-sm"
        underline={isActive ? "always" : "hover"}
      >
        {depth === 0 && node.icon && <node.icon className="w-4 h-4" />}
        {node.title}
      </Link>
    );
  }

  return (
    <Accordion
      defaultSelectedKeys={isExpanded ? [node.title] : []}
      className="px-0 w-full"
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
              {depth === 0 && node.icon && <node.icon className="w-4 h-4" />}
              {node.title}
            </Link>
          ) : (
            <span className={`flex items-center gap-2 ${isActive ? "text-primary font-medium" : ""}`}>
              {depth === 0 && node.icon && <node.icon className="w-4 h-4" />}
              {node.title}
            </span>
          )
        }
      >
        <div className="flex flex-col gap-1 mt-1">
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
  const pathname = usePathname()

  return (
    <aside className="fixed sm:sticky top-[3.75rem] left-0 z-40 sm:z-0 h-[calc(100vh-3.75rem)] w-64 bg-background border-r border-default-200 overflow-y-auto">
      <div className="p-4 flex flex-col gap-2">
        {navigation.map((node) => (
          <SidebarItem key={node.title} node={node} pathname={pathname} depth={0} />
        ))}
      </div>
    </aside>
  );
}
