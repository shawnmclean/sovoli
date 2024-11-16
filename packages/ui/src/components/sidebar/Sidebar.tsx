"use client";

import { usePathname } from "next/navigation";

// using link here because of nextjs full refresh issue: https://github.com/nextui-org/nextui/issues/3786
import { Link } from "../ui/link";
import { Tab, Tabs } from "../ui/tabs";

export function Sidebar() {
  const pathname = usePathname();

  // Define your tabs with their respective paths
  const tabs = [
    { key: "profile", title: "Profile", path: `/settings` },
    {
      key: "imports",
      title: "Imports / Exports",
      path: `/settings/imports`,
    },
  ];

  // Function to determine the active tab
  const getActiveTab = () => {
    const activeTab = tabs.find((tab) => pathname === tab.path);
    return activeTab ? activeTab.key : "profile"; // Default to 'overview' if no match
  };

  return (
    <>
      <Tabs
        isVertical
        aria-label="Options"
        variant="underlined"
        selectedKey={getActiveTab()}
      >
        {tabs.map((tab) => (
          <Tab as={Link} key={tab.key} href={tab.path} title={tab.title} />
        ))}
      </Tabs>
    </>
  );
}
