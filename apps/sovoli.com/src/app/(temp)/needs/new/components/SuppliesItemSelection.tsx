"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Input } from "@sovoli/ui/components/input";
import { Chip } from "@sovoli/ui/components/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { SearchIcon } from "lucide-react";
import { SUPPLIES_ITEMS } from "../data/suppliesItems";
import type { SuppliesItem } from "../data/suppliesItems";

interface SuppliesItemSelectionProps {
  selectedItemIds: Set<string>;
  quantities: Record<string, number>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export function SuppliesItemSelection({
  selectedItemIds,
  quantities,
  onSelectionChange,
  onQuantityChange,
}: SuppliesItemSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    new Set(["building", "food", "other"]),
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
      other: {
        items: [],
        label: "Other Supplies",
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

  const toggleGroup = (category: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedGroups(newSelected);
  };

  // Create a stable string key from the Set for dependency tracking
  // Note: Using size and string representation since Set reference equality doesn't work for React deps
  const selectedItemsKey = useMemo(
    () => Array.from(selectedItemIds).sort().join(","),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Array.from(selectedItemIds).sort().join(",")],
  );

  const topContent = useMemo(() => {
    const arrayValues = Array.from(selectedItemIds);

    if (!arrayValues.length) {
      return null;
    }

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1"
        orientation="horizontal"
      >
        {arrayValues
          .map((itemId) => {
            const item = SUPPLIES_ITEMS.find((i) => i.id === itemId);
            if (!item) return null;
            const qty = quantities[itemId] ?? 0;
            const suffix = qty > 0 ? ` x${qty}` : "";
            return (
              <Chip key={itemId}>
                {item.name}
                {suffix}
              </Chip>
            );
          })
          .filter(Boolean)}
      </ScrollShadow>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemsKey, quantities]);

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    const nextSelected = new Set(selectedItemIds);
    if (checked) {
      nextSelected.add(itemId);
      const existingQuantity = quantities[itemId] ?? 0;
      if (existingQuantity <= 0) {
        onQuantityChange(itemId, 1);
      }
    } else {
      nextSelected.delete(itemId);
      onQuantityChange(itemId, 0);
    }
    onSelectionChange(nextSelected);
  };

  const handleQuantityInput = (itemId: string, value: string) => {
    const parsed = Number.parseInt(value, 10);
    const nextQuantity = Number.isNaN(parsed) ? 0 : Math.max(parsed, 0);
    onQuantityChange(itemId, nextQuantity);

    const nextSelected = new Set(selectedItemIds);
    if (nextQuantity > 0) {
      nextSelected.add(itemId);
    } else {
      nextSelected.delete(itemId);
    }
    onSelectionChange(nextSelected);
  };

  const hasResults = Object.values(filteredGroups).some(
    (group) => group.items.length > 0,
  );

  return (
    <div className="space-y-6">
      {/* Search (sticky) */}
      <div className="sticky top-0 z-20 border-b border-default-200">
        <div className="bg-background/95 backdrop-blur-md py-4">
          <div className="space-y-3">
            <Input
              size="lg"
              placeholder="Search items..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
            />
            {topContent ? <div className="pt-1">{topContent}</div> : null}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-base text-default-500">
          Select the supplies your org currently needs and set the desired
          quantities.
        </p>

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
          <Checkbox
            isSelected={selectedGroups.has("other")}
            onValueChange={() => toggleGroup("other")}
          >
            Other Supplies
          </Checkbox>
        </div>

        {/* Supplies list */}
        <div className="w-full space-y-8">
          {hasResults ? (
            Object.entries(filteredGroups).map(([category, group]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-default-500">
                  {group.label}
                </h3>
                <div className="space-y-3">
                  {group.items.map((item) => {
                    const quantity = quantities[item.id] ?? 0;
                    const displayValue = quantity > 0 ? String(quantity) : "";
                    const isSelected = selectedItemIds.has(item.id);
                    const cardStyles = isSelected
                      ? "border-primary-200 bg-primary-50/60"
                      : "border-default-200 bg-background";
                    const inputId = `quantity-${item.id}`;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border px-4 py-3 transition-colors ${cardStyles}`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <Checkbox
                            isSelected={isSelected}
                            onValueChange={(value) =>
                              handleCheckboxChange(item.id, value)
                            }
                            className="sm:flex-1"
                          >
                            <div className="flex flex-col gap-1 text-left">
                              <span className="font-medium text-default-800">
                                {item.name}
                              </span>
                              {item.source && (
                                <span className="text-xs text-default-400">
                                  ({item.source})
                                </span>
                              )}
                            </div>
                          </Checkbox>
                          <div className="flex items-center gap-3 sm:min-w-[160px]">
                            <label
                              htmlFor={inputId}
                              className="text-sm font-medium text-default-600"
                            >
                              Qty
                            </label>
                            <Input
                              id={inputId}
                              aria-label={`Quantity for ${item.name}`}
                              type="number"
                              inputMode="numeric"
                              min={0}
                              size="sm"
                              value={displayValue}
                              onValueChange={(value) =>
                                handleQuantityInput(item.id, value)
                              }
                              className="w-20"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-default-200 bg-default-50 px-4 py-6 text-center text-default-500">
              No supplies match your search. Try a different keyword or reset
              the filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
