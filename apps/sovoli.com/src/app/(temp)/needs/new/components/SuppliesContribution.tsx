"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Input } from "@sovoli/ui/components/input";
import {
  Listbox,
  ListboxItem,
  ListboxSection,
} from "@sovoli/ui/components/listbox";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Chip } from "@sovoli/ui/components/chip";
import { SearchIcon } from "lucide-react";
import type { SuppliesItem } from "../data/suppliesItems";
import { SUPPLIES_ITEMS } from "../data/suppliesItems";

export type { SuppliesItem };
export { SUPPLIES_ITEMS };

interface SuppliesContributionProps {
  suppliesItems: Record<string, number>;
  suppliesOther: string;
  suppliesItemNotes?: Record<string, string>; // itemId -> notes
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onOtherChange: (value: string) => void;
  onItemNoteChange?: (itemId: string, note: string) => void;
}

export function SuppliesContribution({
  suppliesItems,
  suppliesOther,
  suppliesItemNotes: _suppliesItemNotes = {},
  onItemQuantityChange,
  onOtherChange,
  onItemNoteChange: _onItemNoteChange,
}: SuppliesContributionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    new Set(["food", "building"]),
  );

  // Sort all items grouped by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, { items: SuppliesItem[]; label: string }> = {
      building: {
        items: [],
        label: "Building Supplies",
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

  const selectedKeys = useMemo(() => {
    return new Set(
      Object.keys(suppliesItems).filter(
        (key) => suppliesItems[key] !== undefined && suppliesItems[key] >= 1,
      ),
    );
  }, [suppliesItems]);

  // Create a flat array of all items for easier lookup
  const allItemsFlat = useMemo(() => {
    return SUPPLIES_ITEMS;
  }, []);

  const topContent = useMemo(() => {
    // Show all selected items in topContent
    const selectedItems = Object.keys(suppliesItems)
      .filter((key) => suppliesItems[key] && suppliesItems[key] > 0)
      .map((id) => {
        const item = allItemsFlat.find((i) => i.id === id);
        if (!item) return null;
        return { id, item };
      })
      .filter(
        (item): item is { id: string; item: SuppliesItem } => item !== null,
      );

    if (!selectedItems.length) {
      return null;
    }

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1"
        orientation="horizontal"
      >
        {selectedItems.map(({ id, item }) => (
          <Chip key={id} size="sm">
            {item.name}
          </Chip>
        ))}
      </ScrollShadow>
    );
  }, [suppliesItems, allItemsFlat]);

  const handleSelectionChange = (keys: Set<string> | "all") => {
    if (keys === "all") {
      // Select all items
      SUPPLIES_ITEMS.forEach((item) => {
        if (
          suppliesItems[item.id] === undefined ||
          suppliesItems[item.id] === 0
        ) {
          onItemQuantityChange(item.id, 1);
        }
      });
      return;
    }

    const currentSelected = new Set(
      Object.keys(suppliesItems).filter(
        (key) => suppliesItems[key] !== undefined && suppliesItems[key] >= 1,
      ),
    );

    // Add newly selected items
    keys.forEach((key) => {
      if (!currentSelected.has(key)) {
        onItemQuantityChange(key, 1);
      }
    });

    // Remove unselected items
    currentSelected.forEach((key) => {
      if (!keys.has(key)) {
        onItemQuantityChange(key, 0);
      }
    });
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
            Building Supplies
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
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) =>
              handleSelectionChange(keys as Set<string> | "all")
            }
            variant="flat"
            topContent={topContent}
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
              >
                {group.items.map((item) => {
                  return (
                    <ListboxItem key={item.id} textValue={item.name}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                      </div>
                    </ListboxItem>
                  );
                })}
              </ListboxSection>
            ))}
          </Listbox>
        </div>

        <div>
          <Input
            size="lg"
            label="Other"
            placeholder="Specify other items not listed above"
            value={suppliesOther}
            onValueChange={onOtherChange}
          />
        </div>
      </div>
    </div>
  );
}
