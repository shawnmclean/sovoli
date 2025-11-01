"use client";

import { useMemo } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { NumberInput } from "@sovoli/ui/components/number-input";
import { AlertTriangleIcon, TrashIcon } from "lucide-react";
import { SUPPLIES_ITEMS } from "./SuppliesContribution";
import type { SuppliesItem } from "./SuppliesContribution";

interface SuppliesQuantityManagementProps {
  selectedItemIds: Set<string>;
  suppliesItems: Record<string, number>;
  suppliesItemNotes?: Record<string, string>;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onItemRemove: (itemId: string) => void;
  onItemNoteChange?: (itemId: string, note: string) => void;
}

export function SuppliesQuantityManagement({
  selectedItemIds,
  suppliesItems,
  suppliesItemNotes = {},
  onItemQuantityChange,
  onItemRemove,
  onItemNoteChange,
}: SuppliesQuantityManagementProps) {
  // Get selected items with their details
  const selectedItems = useMemo(() => {
    return Array.from(selectedItemIds)
      .map((id) => {
        const item = SUPPLIES_ITEMS.find((i) => i.id === id);
        if (!item) return null;
        const quantity = suppliesItems[id] ?? 1;
        const note = suppliesItemNotes[id] ?? "";
        return { ...item, quantity, note };
      })
      .filter(
        (item): item is SuppliesItem & { quantity: number; note: string } =>
          item !== null,
      )
      .sort((a, b) => {
        // Sort by category first, then by name
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });
  }, [selectedItemIds, suppliesItems, suppliesItemNotes]);

  if (selectedItems.length === 0) {
    return (
      <div className="space-y-6">
        <p className="text-base text-default-500">
          No items selected. Please go back to select items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-base text-default-500">
        Review your selected items and specify quantities for each.
      </p>

      <div className="space-y-4">
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border ${
              item.highPriority
                ? "border-warning-300 bg-warning-50"
                : "border-default-200"
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {item.highPriority && (
                    <AlertTriangleIcon className="w-5 h-5 text-warning shrink-0" />
                  )}
                  <span className="font-medium">{item.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => onItemRemove(item.id)}
                  startContent={<TrashIcon className="w-4 h-4" />}
                >
                  Remove
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-default-600 min-w-[100px]">
                    Quantity:
                  </label>
                  <NumberInput
                    size="lg"
                    minValue={1}
                    value={item.quantity}
                    onValueChange={(value) => {
                      const numValue = typeof value === "number" ? value : 1;
                      if (numValue > 0) {
                        onItemQuantityChange(item.id, numValue);
                      } else {
                        onItemQuantityChange(item.id, 1);
                      }
                    }}
                    classNames={{
                      base: "max-w-[150px]",
                    }}
                  />
                </div>

                {onItemNoteChange && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-default-600">
                      Notes (optional):
                    </label>
                    <Input
                      size="lg"
                      placeholder="Add any notes about this item..."
                      value={item.note}
                      onValueChange={(value) =>
                        onItemNoteChange(item.id, value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
