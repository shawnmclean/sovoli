"use client";

import { useMemo, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Item, ItemCategory } from "~/modules/core/items/types";

interface ItemsSelectionProps {
  items: Item[];
  selectedItemIds: Set<string>;
  quantities: Record<string, number>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export const getCategoryLabel = (category: ItemCategory) => {
  const names: string[] = [];
  let current: ItemCategory | undefined = category;
  while (current) {
    names.unshift(current.name);
    current = current.parent;
  }
  return names.join(" / ");
};

export function ItemsSelection({
  items,
  selectedItemIds,
  quantities,
  onSelectionChange,
  onQuantityChange,
}: ItemsSelectionProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const groupedItems = useMemo(() => {
    const map = new Map<string, { items: Item[]; label: string }>();
    items.forEach((item) => {
      const key = item.category.id;
      const existing = map.get(key);
      if (existing) {
        existing.items.push(item);
        return;
      }
      map.set(key, {
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

  const handleQuickIncrement = (itemId: string, increment: number) => {
    const currentQuantity = quantities[itemId] ?? 0;
    updateQuantity(itemId, currentQuantity + increment);
  };

  const handleDirectInput = (itemId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      updateQuantity(itemId, numValue);
    }
  };

  const handleInputFocus = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const handleInputBlur = () => {
    setEditingItemId(null);
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
                          <div className="flex items-center gap-3 sm:min-w-[240px] sm:justify-end">
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

                                {editingItemId === item.id ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    value={quantity.toString()}
                                    onChange={(e) =>
                                      handleDirectInput(item.id, e.target.value)
                                    }
                                    onBlur={handleInputBlur}
                                    className="w-16 text-center text-sm"
                                    size="sm"
                                    autoFocus
                                  />
                                ) : (
                                  <button
                                    onClick={() => handleInputFocus(item.id)}
                                    className="min-w-[2rem] rounded px-2 py-1 text-center text-sm font-semibold text-default-700 hover:bg-default-100"
                                    aria-label={`Edit quantity of ${item.name}`}
                                  >
                                    {quantity}
                                  </button>
                                )}

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

                                {/* +10 quick increment button */}
                                <Button
                                  size="sm"
                                  variant="flat"
                                  color="default"
                                  className="h-8 px-2 text-xs font-medium"
                                  onPress={() =>
                                    handleQuickIncrement(item.id, 10)
                                  }
                                  aria-label={`Add 10 more ${item.name}`}
                                >
                                  +10
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
