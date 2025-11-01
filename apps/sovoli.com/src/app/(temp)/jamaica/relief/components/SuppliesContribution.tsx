"use client";

import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Input } from "@sovoli/ui/components/input";

export interface SuppliesItem {
  id: string;
  name: string;
  category: "food" | "building" | "other";
}

export const SUPPLIES_ITEMS: SuppliesItem[] = [
  // Food items
  { id: "canned-goods", name: "Canned Goods", category: "food" },
  { id: "rice", name: "Rice", category: "food" },
  { id: "beans", name: "Beans", category: "food" },
  { id: "water", name: "Bottled Water", category: "food" },
  { id: "baby-formula", name: "Baby Formula", category: "food" },
  { id: "non-perishable", name: "Non-perishable Foods", category: "food" },
  // Building supplies
  { id: "plywood", name: "Plywood", category: "building" },
  { id: "tarps", name: "Tarps", category: "building" },
  { id: "nails", name: "Nails", category: "building" },
  { id: "screws", name: "Screws", category: "building" },
  { id: "tools", name: "Tools", category: "building" },
  { id: "lumber", name: "Lumber", category: "building" },
];

interface SuppliesContributionProps {
  suppliesItems: Record<string, number>;
  suppliesOther: string;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onOtherChange: (value: string) => void;
}

export function SuppliesContribution({
  suppliesItems,
  suppliesOther,
  onItemQuantityChange,
  onOtherChange,
}: SuppliesContributionProps) {
  const foodItems = SUPPLIES_ITEMS.filter((i) => i.category === "food");
  const buildingItems = SUPPLIES_ITEMS.filter((i) => i.category === "building");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Select supplies</h2>
      <p className="text-base text-default-500">
        Select the items you can provide and specify quantities.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Food Supplies</h3>
          <div className="space-y-3">
            {foodItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 border border-default-200 rounded-xl"
              >
                <Checkbox
                  isSelected={suppliesItems[item.id] !== undefined}
                  onValueChange={(isSelected) => {
                    if (isSelected) {
                      onItemQuantityChange(item.id, 1);
                    } else {
                      onItemQuantityChange(item.id, 0);
                    }
                  }}
                >
                  {item.name}
                </Checkbox>
                {suppliesItems[item.id] !== undefined && (
                  <Input
                    type="number"
                    min={1}
                    placeholder="Quantity"
                    value={String(suppliesItems[item.id] ?? "")}
                    onValueChange={(value) => {
                      const num = Number(value);
                      if (!Number.isNaN(num) && num > 0) {
                        onItemQuantityChange(item.id, num);
                      }
                    }}
                    className="w-32"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Building Supplies</h3>
          <div className="space-y-3">
            {buildingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 border border-default-200 rounded-xl"
              >
                <Checkbox
                  isSelected={suppliesItems[item.id] !== undefined}
                  onValueChange={(isSelected) => {
                    if (isSelected) {
                      onItemQuantityChange(item.id, 1);
                    } else {
                      onItemQuantityChange(item.id, 0);
                    }
                  }}
                >
                  {item.name}
                </Checkbox>
                {suppliesItems[item.id] !== undefined && (
                  <Input
                    type="number"
                    min={1}
                    placeholder="Quantity"
                    value={String(suppliesItems[item.id] ?? "")}
                    onValueChange={(value) => {
                      const num = Number(value);
                      if (!Number.isNaN(num) && num > 0) {
                        onItemQuantityChange(item.id, num);
                      }
                    }}
                    className="w-32"
                  />
                )}
              </div>
            ))}
          </div>
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
