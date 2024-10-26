"use client";

import { usePathname } from "next/navigation";

import { Tab, Tabs } from "../ui/tabs";

export function KnowledgeSubmenu() {
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
        key="content"
        title={
          <div className="flex items-center space-x-2">
            <span>Content</span>
          </div>
        }
      />
      <Tab
        key="connections"
        title={
          <div className="flex items-center space-x-2">
            <span>Connections</span>
          </div>
        }
      />
    </Tabs>
  );
}
