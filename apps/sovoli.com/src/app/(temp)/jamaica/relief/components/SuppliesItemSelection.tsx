"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Input } from "@sovoli/ui/components/input";
import {
  Listbox,
  ListboxItem,
  ListboxSection,
} from "@sovoli/ui/components/listbox";
import { AlertTriangleIcon, SearchIcon } from "lucide-react";
import { SUPPLIES_ITEMS, SuppliesItem } from "./SuppliesContribution";

interface SuppliesItemSelectionProps {
  selectedItemIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
}

export function SuppliesItemSelection({
  selectedItemIds,
  onSelectionChange,
}: SuppliesItemSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    new Set(["food", "building"]),
  );

  // Sort all items: high priority first, then regular items, grouped by category
  const groupedItems = useMemo(() => {
    const groups: Record<
      string,
      { items: SuppliesItem[]; label: string; important?: boolean }
    > = {
      building: {
        items: [],
        label: "Building Supplies",
        important: true,
      },
      food: {
        items: [],
        label: "Food Supplies",
      },
    };

    SUPPLIES_ITEMS.forEach((item) => {
      const group = groups[item.category];
      if (group) {
        group.items.push(item);
      }
    });

    // Sort items within each group: high priority first
    Object.keys(groups).forEach((category) => {
      const group = groups[category];
      if (group) {
        group.items.sort((a, b) => {
          if (a.highPriority && !b.highPriority) return -1;
          if (!a.highPriority && b.highPriority) return 1;
          return 0;
        });
      }
    });

    return groups;
  }, []);

  // Filter items based on search query and selected groups
  const filteredGroups = useMemo(() => {
    const filtered: typeof groupedItems = {};

    Object.entries(groupedItems).forEach(([category, group]) => {
      // Filter by selected groups
      if (!selectedGroups.has(category)) {
        return;
      }

      // Filter by search query
      const filteredItems = group.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      if (filteredItems.length > 0) {
        filtered[category] = {
          ...group,
          items: filteredItems,
        };
      }
    });

    return filtered;
  }, [groupedItems, selectedGroups, searchQuery]);

  const handleSelectionChange = (keys: Set<string> | "all") => {
    if (keys === "all") {
      // Select all items
      const allIds = new Set(SUPPLIES_ITEMS.map((item) => item.id));
      onSelectionChange(allIds);
      return;
    }

    onSelectionChange(keys);
  };

  const toggleGroup = (category: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedGroups(newSelected);
  };

  return (
    <div className="space-y-6">
      <p className="text-base text-default-500">
        Select the items you can provide.
      </p>

      <div className="space-y-6">
        {/* Search */}
        <Input
          size="lg"
          placeholder="Search items..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
        />

        {/* Group Filters */}
        <div className="flex flex-wrap gap-4">
          <Checkbox
            isSelected={selectedGroups.has("building")}
            onValueChange={() => toggleGroup("building")}
          >
            <div className="flex items-center gap-2">
              <span>Building Supplies</span>
              <AlertTriangleIcon className="w-4 h-4 text-warning" />
            </div>
          </Checkbox>
          <Checkbox
            isSelected={selectedGroups.has("food")}
            onValueChange={() => toggleGroup("food")}
          >
            Food Supplies
          </Checkbox>
        </div>

        {/* Listbox with grouped items */}
        <div className="w-full border border-default-200 px-1 py-2 rounded-lg">
          <Listbox
            aria-label="Supplies selection"
            selectionMode="multiple"
            selectedKeys={selectedItemIds}
            onSelectionChange={(keys) =>
              handleSelectionChange(keys as Set<string> | "all")
            }
            variant="flat"
            classNames={{
              base: "max-w-full",
              list: "max-h-[300px] overflow-scroll gap-2",
            }}
          >
            {Object.entries(filteredGroups).map(([category, group]) => (
              <ListboxSection
                key={category}
                title={group.label}
                aria-label={group.label}
                showDivider={false}
                classNames={{
                  heading: group.important
                    ? "flex items-center gap-2 text-warning-600"
                    : undefined,
                }}
              >
                {group.items.map((item) => {
                  return (
                    <ListboxItem
                      key={item.id}
                      textValue={item.name}
                      classNames={{
                        base: `${
                          item.highPriority
                            ? "border-warning-300 bg-warning-50"
                            : ""
                        } mb-2`,
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {item.highPriority && (
                          <AlertTriangleIcon className="w-5 h-5 text-warning shrink-0" />
                        )}
                        <span className="truncate">{item.name}</span>
                      </div>
                    </ListboxItem>
                  );
                })}
              </ListboxSection>
            ))}
          </Listbox>
        </div>
      </div>
    </div>
  );
}
