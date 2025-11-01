"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Input } from "@sovoli/ui/components/input";
import { NumberInput } from "@sovoli/ui/components/number-input";
import {
  Listbox,
  ListboxItem,
  ListboxSection,
} from "@sovoli/ui/components/listbox";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Chip } from "@sovoli/ui/components/chip";
import { AlertTriangleIcon, SearchIcon } from "lucide-react";

export interface SuppliesItem {
  id: string;
  name: string;
  category: "food" | "building" | "other";
  highPriority?: boolean;
}

export const SUPPLIES_ITEMS: SuppliesItem[] = [
  // Food items
  { id: "canned-goods", name: "Canned Goods", category: "food" },
  { id: "rice", name: "Rice", category: "food", highPriority: true },
  { id: "beans", name: "Beans", category: "food" },
  { id: "water", name: "Bottled Water", category: "food", highPriority: true },
  {
    id: "baby-formula",
    name: "Baby Formula",
    category: "food",
    highPriority: true,
  },
  { id: "non-perishable", name: "Non-perishable Foods", category: "food" },
  // Building supplies
  { id: "plywood", name: "Plywood", category: "building", highPriority: true },
  { id: "tarps", name: "Tarps", category: "building", highPriority: true },
  { id: "nails", name: "Nails", category: "building" },
  { id: "screws", name: "Screws", category: "building" },
  { id: "tools", name: "Tools", category: "building" },
  { id: "lumber", name: "Lumber", category: "building" },
];

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
  suppliesItemNotes = {},
  onItemQuantityChange,
  onOtherChange,
  onItemNoteChange,
}: SuppliesContributionProps) {
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
    // Show all items with quantity > 0 in topContent
    const itemsWithQuantity = Object.entries(suppliesItems)
      .filter(([, quantity]) => quantity > 0)
      .map(([id]) => {
        const item = allItemsFlat.find((i) => i.id === id);
        const quantity = suppliesItems[id];
        if (!item) return null;
        return { id, item, quantity };
      })
      .filter(
        (item): item is { id: string; item: SuppliesItem; quantity: number } =>
          item !== null,
      );

    if (!itemsWithQuantity.length) {
      return null;
    }

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1"
        orientation="horizontal"
      >
        {itemsWithQuantity.map(({ id, item, quantity }) => (
          <Chip key={id} size="sm">
            {item.name} ({quantity})
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

    // Add newly selected items with quantity 1
    keys.forEach((key) => {
      if (!currentSelected.has(key)) {
        const currentQuantity = suppliesItems[key] ?? 0;
        if (currentQuantity < 1) {
          onItemQuantityChange(key, 1);
        }
      }
    });

    // Remove unselected items - set to 0
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
        Select the items you can provide and specify quantities.
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
                classNames={{
                  heading: group.important
                    ? "flex items-center gap-2 text-warning-600"
                    : undefined,
                }}
              >
                {group.items.map((item) => {
                  const quantity = suppliesItems[item.id] ?? 0;
                  const isSelected = quantity >= 1;
                  const note = suppliesItemNotes[item.id] ?? "";
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
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {item.highPriority && (
                              <AlertTriangleIcon className="w-5 h-5 text-warning shrink-0" />
                            )}
                            <span className="truncate">{item.name}</span>
                          </div>
                          <NumberInput
                            minValue={0}
                            value={quantity}
                            onValueChange={(value) => {
                              if (typeof value === "number" && value >= 0) {
                                onItemQuantityChange(item.id, value);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-32 shrink-0"
                            size="sm"
                          />
                        </div>
                        {isSelected && onItemNoteChange && (
                          <div className="ml-6">
                            <Input
                              placeholder="Add additional information (optional)"
                              value={note}
                              onValueChange={(value) =>
                                onItemNoteChange(item.id, value)
                              }
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
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
