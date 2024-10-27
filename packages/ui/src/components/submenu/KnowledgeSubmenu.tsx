"use client";

import { usePathname } from "next/navigation";

// using link here because of nextjs full refresh issue: https://github.com/nextui-org/nextui/issues/3786
import { Link } from "../ui/link";
import { Tab, Tabs } from "../ui/tabs";

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
      key: "connections",
      title: "Connections",
      path: `/${username}/${slug}/connections`,
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
          "gap-6 w-full relative rounded-none p-0 border-b border-divider px-5",
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
