"use client";

import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import { ListIcon, MapIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Key } from "react";
import { useMemo } from "react";

type DirectoryView = "list" | "map";

const DEFAULT_VIEW: DirectoryView = "list";

interface DirectoryViewTabsProps {
  defaultView?: DirectoryView;
}

export function DirectoryViewTabs({
  defaultView = DEFAULT_VIEW,
}: DirectoryViewTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = useMemo<DirectoryView>(() => {
    const view = searchParams.get("view");
    if (view === "map") return "map";
    return defaultView;
  }, [defaultView, searchParams]);

  const handleChange = (key: Key | null) => {
    if (!key) return;
    const nextView = key as DirectoryView;
    const params = new URLSearchParams(searchParams.toString());

    if (nextView === "map") {
      params.set("view", "map");
    } else {
      params.delete("view");
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
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
