"use client";

import { usePathname } from "next/navigation";

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
      color="primary"
      variant="underlined"
      classNames={{
        tabList:
          "gap-6 w-full relative rounded-none p-0 border-b border-divider px-5",
        cursor: "w-full bg-[#22d3ee]",
        tab: "max-w-fit px-0 h-12",
        tabContent: "group-data-[selected=true]:text-[#06b6d4]",
      }}
      selectedKey={getActiveTab()}
    >
      {tabs.map((tab) => (
        <Tab
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
