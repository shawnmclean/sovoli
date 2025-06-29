"use client";

import type { Key } from "react";
import { useState } from "react";
import { Tabs, Tab } from "@sovoli/ui/components/tabs";
import { ListIcon, MapIcon } from "lucide-react";

export function DirectoryViewTabs() {
  const [selected, setSelected] = useState("list");

  const handleChange = (key: Key | null) => {
    if (key === "map") {
      alert("Map coming soon");
      return;
    }
    setSelected(key as string);
  };

  return (
    <Tabs
      aria-label="View options"
      variant="bordered"
      selectedKey={selected}
      onSelectionChange={handleChange}
      size="sm"
      classNames={{
        tab: "px-2 py-1 text-xs",
        tabContent: "gap-0.5",
      }}
    >
      <Tab
        key="list"
        title={
          <div className="flex items-center gap-1">
            <ListIcon className="w-4 h-4" />
            List
          </div>
        }
      />
      <Tab
        key="map"
        title={
          <div className="flex items-center gap-1">
            <MapIcon className="w-4 h-4" />
            Map
          </div>
        }
      />
    </Tabs>
  );
}
