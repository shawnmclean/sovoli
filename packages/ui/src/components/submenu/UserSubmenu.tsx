"use client";

import { usePathname } from "next/navigation";

import { Link } from "../ui/link";
import { Tab, Tabs } from "../ui/tabs";

export interface UserSubmenuProps {
  username: string;
}

export function UserSubmenu({ username }: UserSubmenuProps) {
  const pathname = usePathname();

  // Define your tabs with their respective paths
  const tabs = [
    { key: "overview", title: "Overview", path: `/${username}` },
    {
      key: "collections",
      title: "Collections",
      path: `/${username}/collections`,
    },
    { key: "shelves", title: "Shelves", path: `/${username}/shelves` },
  ];

  // Function to determine the active tab
  const getActiveTab = () => {
    const activeTab = tabs.find((tab) => pathname === tab.path);
    return activeTab ? activeTab.key : "overview"; // Default to 'overview' if no match
  };

  return (
    <>
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
    </>
  );
}
