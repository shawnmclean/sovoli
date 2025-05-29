"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { RocketIcon, LockIcon } from "lucide-react";

const navigation = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: RocketIcon,
    items: [
      { title: "Introduction", href: "/docs/" },
    ],
  },
  {
    id: "internal",
    title: "Internal Docs",
    icon: LockIcon,
    items: [
      { title: "Internal Documentation", href: "/docs/internal" },
      { title: "Onboarding", href: '/docs/internal/onboarding'}
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed sm:sticky top-[3.75rem] left-0 z-40 sm:z-0
        h-[calc(100vh-3.75rem)] w-64 bg-background
        border-r border-default-200 overflow-y-auto
      `}
    >
      <div className="p-4">
        <Accordion
          variant="light"
          selectionMode="multiple"
          className="gap-1"
        >
          {navigation.map((section) => (
            <AccordionItem
              key={section.id}
              aria-label={section.title}
              title={
                <div className="flex items-center gap-2 text-sm font-medium">
                  <section.icon width={18} />
                  {section.title}
                </div>
              }
              classNames={{
                title: "py-1.5",
                trigger: "py-0",
                content: "pb-0",
              }}
            >
              <div className="flex flex-col gap-1 pl-6 py-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        px-2 py-1.5 rounded-small text-sm
                        ${isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-default-100"
                        }
                      `}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
}
