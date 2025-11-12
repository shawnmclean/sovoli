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
import { ALL_ITEMS } from "~/modules/data/items";
import type { Item } from "~/modules/core/items/types";
import type { ItemCategory } from "./ItemsSelection";
import { getCategoryLabel } from "./ItemsSelection";

interface SuppliesContributionProps {
  suppliesItems: Record<string, number>;
  suppliesOther: string;
  suppliesItemNotes?: Record<string, string>; // itemId -> notes
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onOtherChange: (value: string) => void;
  onItemNoteChange?: (itemId: string, note: string) => void;
}

const ALL_CATEGORY_KEYS = Array.from(
  new Set<ItemCategory>(ALL_ITEMS.map((item) => item.category)),
);

const ALL_ITEMS_BY_ID = ALL_ITEMS.reduce<Record<string, Item>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

export function SuppliesContribution({
  suppliesItems,
  suppliesOther,
  suppliesItemNotes: _suppliesItemNotes = {},
  onItemQuantityChange,
  onOtherChange,
  onItemNoteChange: _onItemNoteChange,
}: SuppliesContributionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<ItemCategory>>(
    () => new Set(ALL_CATEGORY_KEYS),
  );

  // Filter items based on search query and selected groups
  const filteredGroups = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    return ALL_CATEGORY_KEYS.flatMap((category) => {
      if (!activeCategories.has(category)) {
        return [];
      }

      const categoryItems = ALL_ITEMS.filter((item) => {
        if (item.category !== category) {
          return false;
        }

        if (trimmedQuery.length === 0) {
          return true;
        }

        return item.name.toLowerCase().includes(trimmedQuery);
      });

      if (categoryItems.length === 0) {
        return [];
      }

      return [
        {
          category,
          label: getCategoryLabel(category),
          items: categoryItems,
        },
      ];
    });
  }, [activeCategories, searchQuery]);

  const selectedKeys = useMemo(() => {
    return new Set(
      Object.keys(suppliesItems).filter(
        (key) => suppliesItems[key] !== undefined && suppliesItems[key] >= 1,
      ),
    );
  }, [suppliesItems]);

  const topContent = useMemo(() => {
    // Show all selected items in topContent
    const selectedItems = Object.keys(suppliesItems)
      .filter((key) => suppliesItems[key] && suppliesItems[key] > 0)
      .map((id) => {
        const item = ALL_ITEMS_BY_ID[id];
        if (!item) return null;
        return { id, item };
      })
      .filter((item): item is { id: string; item: Item } => item !== null);

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
  }, [suppliesItems]);

  const handleSelectionChange = (keys: Set<string> | "all") => {
    if (keys === "all") {
      // Select all items
      ALL_ITEMS.forEach((item) => {
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

  const toggleGroup = (category: ItemCategory) => {
    const newSelected = new Set(activeCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setActiveCategories(newSelected);
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
          {ALL_CATEGORY_KEYS.map((category) => (
            <Checkbox
              key={category}
              isSelected={activeCategories.has(category)}
              onValueChange={() => toggleGroup(category)}
            >
              {getCategoryLabel(category)}
            </Checkbox>
          ))}
        </div>

        {/* Listbox with grouped items */}
        <div className="w-full rounded-lg border border-default-200 px-1 py-2">
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
            {filteredGroups.map((group) => (
              <ListboxSection
                key={group.category}
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
