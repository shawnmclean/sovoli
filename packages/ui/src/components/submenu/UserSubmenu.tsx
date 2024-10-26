"use client";

import { usePathname } from "next/navigation";

import { Tab, Tabs } from "../ui/tabs";

export function UserSubmenu() {
  const pathname = usePathname();

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
      selectedKey={pathname}
    >
      <Tab
        key="overview"
        title={
          <div className="flex items-center space-x-2">
            <span>Overview</span>
          </div>
        }
      />
      <Tab
        key="collections"
        title={
          <div className="flex items-center space-x-2">
            <span>Collections</span>
          </div>
        }
      />
      <Tab
        key="shelves"
        title={
          <div className="flex items-center space-x-2">
            <span>Shelves</span>
          </div>
        }
      />
    </Tabs>
  );
}
