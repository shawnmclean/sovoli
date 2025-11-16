"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { Input } from "@sovoli/ui/components/input";

import type { ReliefFormData, ReliefFormUpdater } from "./ReliefForm";
import { ItemsSelection, getCategoryLabel } from "./ItemsSelection";
import type { ItemCategory } from "~/modules/core/items/types";
import { ItemsSearchNavBar } from "./ItemsSearchNavBar";
import { ALL_ITEMS } from "~/modules/data/items";

interface ItemsSelectionStepProps {
  formData: ReliefFormData;
  onUpdate: ReliefFormUpdater;
  setFormData: Dispatch<SetStateAction<ReliefFormData>>;
}

const ALL_ITEMS_BY_ID = new Map(ALL_ITEMS.map((item) => [item.id, item]));
const ALL_CATEGORY_KEYS = Array.from(
  new Set<string>(ALL_ITEMS.map((item) => item.category.id)),
);
const PREFERRED_CATEGORY_KEYS = [
  "hardware",
  "hygiene",
  "bedding",
] satisfies readonly string[];
const PREFERRED_CATEGORY_SET = new Set<string>(PREFERRED_CATEGORY_KEYS);
const INITIAL_ACTIVE_CATEGORIES = (() => {
  const preferred = ALL_CATEGORY_KEYS.filter((categoryId) =>
    PREFERRED_CATEGORY_SET.has(categoryId),
  );
  if (preferred.length > 0) {
    return new Set<string>(preferred);
  }
  if (ALL_CATEGORY_KEYS.length > 0) {
    return new Set<string>(ALL_CATEGORY_KEYS);
  }
  return new Set<string>();
})();
type CategoryFilterKey = string;

export function ItemsSelectionStep({
  formData,
  onUpdate,
  setFormData,
}: ItemsSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(INITIAL_ACTIVE_CATEGORIES),
  );

  const selectedItemIds = useMemo(
    () => new Set(formData.suppliesSelected),
    [formData.suppliesSelected],
  );

  const allCategoriesActive =
    activeCategories.size === ALL_CATEGORY_KEYS.length;

  const categoryOptions = useMemo(() => {
    // Create a map of category ID to ItemCategory for label lookup
    const categoryMap = new Map<string, ItemCategory>();
    for (const item of ALL_ITEMS) {
      if (!categoryMap.has(item.category.id)) {
        categoryMap.set(item.category.id, item.category);
      }
    }

    return [
      {
        key: "all" as const,
        label: "All categories",
        isActive: allCategoriesActive,
      },
      ...ALL_CATEGORY_KEYS.map((categoryId) => {
        const category = categoryMap.get(categoryId);
        return {
          key: categoryId,
          label: category ? getCategoryLabel(category) : categoryId,
          isActive: activeCategories.has(categoryId),
        };
      }),
    ];
  }, [activeCategories, allCategoriesActive]);

  const filteredItems = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (
      trimmedQuery.length === 0 &&
      activeCategories.size === ALL_CATEGORY_KEYS.length
    ) {
      return ALL_ITEMS;
    }

    return ALL_ITEMS.filter((item) => {
      if (!activeCategories.has(item.category.id)) {
        return false;
      }

      if (trimmedQuery.length === 0) {
        return true;
      }

      const haystack = [
        item.name,
        item.brand,
        item.attributes?.source,
        item.unitLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(trimmedQuery);
    });
  }, [activeCategories, searchQuery]);

  const selectedItemsSummary = useMemo(() => {
    return formData.suppliesSelected
      .map((itemId) => {
        const item = ALL_ITEMS_BY_ID.get(itemId);
        if (!item) {
          return undefined;
        }
        return {
          id: itemId,
          name: item.name,
          quantity: formData.suppliesQuantities[itemId] ?? 0,
        };
      })
      .filter(
        (
          value,
        ): value is {
          id: string;
          name: string;
          quantity: number;
        } => value !== undefined,
      );
  }, [formData.suppliesQuantities, formData.suppliesSelected]);

  const handleSelectionChange = (selectedIds: Set<string>) => {
    setFormData((prev) => {
      const nextSelected = Array.from(selectedIds);
      const nextQuantities = nextSelected.reduce<Record<string, number>>(
        (acc, itemId) => {
          const existingQuantity = prev.suppliesQuantities[itemId];
          acc[itemId] =
            existingQuantity && existingQuantity > 0 ? existingQuantity : 1;
          return acc;
        },
        {},
      );

      return {
        ...prev,
        suppliesSelected: nextSelected,
        suppliesQuantities: nextQuantities,
      };
    });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      suppliesQuantities: {
        ...prev.suppliesQuantities,
        [itemId]: quantity,
      },
    }));
  };

  const handleToggleCategory = (categoryKey: CategoryFilterKey) => {
    setActiveCategories((prev) => {
      if (categoryKey === "all") {
        if (prev.size === ALL_CATEGORY_KEYS.length) {
          return new Set<string>();
        }
        return new Set<string>(ALL_CATEGORY_KEYS);
      }

      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <ItemsSearchNavBar
        categories={categoryOptions}
        onSearchQueryChange={setSearchQuery}
        onToggleCategory={handleToggleCategory}
        searchQuery={searchQuery}
        selectedItems={selectedItemsSummary}
      />

      <section className="mx-auto w-full max-w-5xl px-4 pb-12 gap-4 flex flex-col">
        <ItemsSelection
          items={filteredItems}
          selectedItemIds={selectedItemIds}
          quantities={formData.suppliesQuantities}
          onSelectionChange={handleSelectionChange}
          onQuantityChange={handleQuantityChange}
        />

        <Input
          size="lg"
          label="Other supplies"
          placeholder="List any additional items not shown above"
          value={formData.suppliesOther}
          onValueChange={(value: string) => onUpdate("suppliesOther", value)}
        />
      </section>
    </div>
  );
}
