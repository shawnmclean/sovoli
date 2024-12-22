"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tab, Tabs } from "@sovoli/ui/components/tabs";

// using link here because of nextjs full refresh issue: https://github.com/nextui-org/nextui/issues/3786

export interface KnowledgeSubmenuProps {
  username: string;
  slug: string;
}

export function KnowledgeSubmenu({ username, slug }: KnowledgeSubmenuProps) {
  const pathname = usePathname();
  // Define your tabs with their respective paths
  const tabs = [
    {
      key: "content",
      title: "Content",
      path: `/${username}/${slug}`,
    },
    {
      key: "discussions",
      title: "Discussions",
      path: `/${username}/${slug}/discussions`,
    },
    {
      key: "graph",
      title: "Graph",
      path: `/${username}/${slug}/graph`,
    },
    // Add more tabs as needed
  ];

  // Function to determine the active tab
  const getActiveTab = () => {
    const activeTab = tabs.find((tab) => pathname === tab.path);
    return activeTab ? activeTab.key : "content"; // Default to 'content' if no match
  };
  return (
    <Tabs
      aria-label="Options"
      variant="underlined"
      classNames={{
        tabList:
          "gap-6 w-full relative rounded-none p-0 border-b border-divider px-6",
        cursor: "w-full",
        tab: "max-w-fit px-0 h-12",
      }}
      selectedKey={getActiveTab()}
    >
      {tabs.map((tab) => (
        <Tab
          as={Link}
          key={tab.key}
          href={tab.path}
          title={
            <div className="flex items-center space-x-2">
              <span>{tab.title}</span>
            </div>
          }
        />
      ))}
    </Tabs>
  );
}
