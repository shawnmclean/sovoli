"use client";

import { useMemo } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Item } from "~/modules/core/items/types";

interface ItemsSelectionProps {
  items: Item[];
  selectedItemIds: Set<string>;
  quantities: Record<string, number>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export type ItemCategory = Item["category"];

export const getCategoryLabel = (category: ItemCategory) =>
  category
    .split("-")
    .map((segment) => {
      if (segment.length === 0) {
        return segment;
      }
      const firstChar = segment.charAt(0).toUpperCase();
      return `${firstChar}${segment.slice(1)}`;
    })
    .join(" ");

export function ItemsSelection({
  items,
  selectedItemIds,
  quantities,
  onSelectionChange,
  onQuantityChange,
}: ItemsSelectionProps) {
  const groupedItems = useMemo(() => {
    const map = new Map<ItemCategory, { items: Item[]; label: string }>();
    items.forEach((item) => {
      const existing = map.get(item.category);
      if (existing) {
        existing.items.push(item);
        return;
      }
      map.set(item.category, {
        items: [item],
        label: getCategoryLabel(item.category),
      });
    });
    return Array.from(map.entries());
  }, [items]);

  const updateQuantity = (itemId: string, proposedQuantity: number) => {
    const nextQuantity = Math.max(proposedQuantity, 0);
    onQuantityChange(itemId, nextQuantity);
    const nextSelected = new Set(selectedItemIds);
    if (nextQuantity > 0) {
      nextSelected.add(itemId);
    } else {
      nextSelected.delete(itemId);
    }
    onSelectionChange(nextSelected);
  };

  const handleAddToList = (itemId: string) => {
    const currentQuantity = quantities[itemId] ?? 0;
    const nextQuantity = currentQuantity > 0 ? currentQuantity : 1;
    updateQuantity(itemId, nextQuantity);
  };

  const handleIncrement = (itemId: string) => {
    const currentQuantity = quantities[itemId] ?? 0;
    updateQuantity(itemId, currentQuantity + 1);
  };

  const handleDecrement = (itemId: string) => {
    const currentQuantity = quantities[itemId] ?? 0;
    if (currentQuantity <= 1) {
      updateQuantity(itemId, 0);
      return;
    }
    updateQuantity(itemId, currentQuantity - 1);
  };

  const hasResults = groupedItems.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <p className="text-base text-default-500">
          Select the supplies your org currently needs and set the desired
          quantities.
        </p>

        <div className="w-full space-y-8">
          {hasResults ? (
            groupedItems.map(([category, group]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-default-500">
                  {group.label}
                </h3>
                <div className="space-y-3">
                  {group.items.map((item) => {
                    const quantity = quantities[item.id] ?? 0;
                    const isSelected = selectedItemIds.has(item.id);
                    const cardStyles = isSelected
                      ? "border-primary-200 bg-primary-50/60"
                      : "border-default-200 bg-background";
                    const secondaryLine =
                      item.brand ?? item.attributes?.source ?? item.unitLabel;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border px-4 py-3 transition-colors ${cardStyles}`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-1 flex-col gap-1 text-left">
                            <span className="font-medium text-default-800">
                              {item.name}
                            </span>
                            {secondaryLine ? (
                              <span className="text-xs text-default-400">
                                {secondaryLine}
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-3 sm:min-w-[180px] sm:justify-end">
                            {isSelected ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="default"
                                  onPress={() => handleDecrement(item.id)}
                                  aria-label={
                                    quantity > 1
                                      ? `Decrease quantity of ${item.name}`
                                      : `Remove ${item.name} from list`
                                  }
                                >
                                  {quantity > 1 ? (
                                    <Minus className="h-4 w-4" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                                <span className="min-w-[1.5rem] text-center text-sm font-semibold text-default-700">
                                  {quantity}
                                </span>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="default"
                                  onPress={() => handleIncrement(item.id)}
                                  aria-label={`Increase quantity of ${item.name}`}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                color="primary"
                                onPress={() => handleAddToList(item.id)}
                                aria-label={`Add ${item.name} to list`}
                              >
                                Add to list
                              </Button>
                            )}
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
