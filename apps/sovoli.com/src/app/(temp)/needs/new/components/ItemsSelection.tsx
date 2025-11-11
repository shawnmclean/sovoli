"use client";

import { useMemo } from "react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Input } from "@sovoli/ui/components/input";
import type { Item } from "~/modules/core/items/types";

interface ItemsSelectionProps {
  items: Item[];
  selectedItemIds: Set<string>;
  quantities: Record<string, number>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export type ItemCategory = Item["category"];

const CATEGORY_LABELS = new Map<ItemCategory, string>([
  ["book", "Books"],
  ["uniform", "Uniforms"],
  ["material", "Materials"],
  ["equipment", "Equipment"],
  ["tool", "Tools"],
  ["furniture", "Furniture"],
  ["electronics", "Electronics"],
  ["hygiene", "Hygiene"],
  ["food", "Food"],
  ["service", "Services"],
  ["other", "Other Items"],
]);

export const getCategoryLabel = (category: ItemCategory) => {
  const label = CATEGORY_LABELS.get(category);
  if (label) {
    return label;
  }
  return category
    .split("-")
    .map((segment) => {
      if (segment.length === 0) {
        return segment;
      }
      const firstChar = segment.charAt(0).toUpperCase();
      return `${firstChar}${segment.slice(1)}`;
    })
    .join(" ");
};

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
                    const displayValue = quantity > 0 ? String(quantity) : "";
                    const isSelected = selectedItemIds.has(item.id);
                    const cardStyles = isSelected
                      ? "border-primary-200 bg-primary-50/60"
                      : "border-default-200 bg-background";
                    const inputId = `quantity-${item.id}`;
                    const secondaryLine =
                      item.brand ?? item.attributes?.source ?? item.unitLabel;
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
                              {secondaryLine && (
                                <span className="text-xs text-default-400">
                                  {secondaryLine}
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
