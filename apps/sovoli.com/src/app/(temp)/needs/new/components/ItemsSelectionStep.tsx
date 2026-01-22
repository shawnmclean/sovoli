"use client";

import { Input } from "@sovoli/ui/components/input";
import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { ALL_ITEMS } from "~/modules/data/items";
import { CATEGORY_INDEX } from "~/modules/data/items/categories";
import { ItemsSearchNavBar } from "./ItemsSearchNavBar";
import { ItemsSelection } from "./ItemsSelection";
import type { ReliefFormData, ReliefFormUpdater } from "./ReliefForm";

interface ItemsSelectionStepProps {
  formData: ReliefFormData;
  onUpdate: ReliefFormUpdater;
  setFormData: Dispatch<SetStateAction<ReliefFormData>>;
}

const ALL_ITEMS_BY_ID = new Map(ALL_ITEMS.map((item) => [item.id, item]));
const ALL_CATEGORY_KEYS = Array.from(
  new Set<string>(ALL_ITEMS.map((item) => item.category.id)),
);

// Helper function to get all descendant category IDs from a parent category
function getAllDescendantCategoryIds(parentCategoryId: string): string[] {
  const descendants: string[] = [];

  // Find all categories that have this parent in their hierarchy
  for (const categoryId of Object.keys(CATEGORY_INDEX)) {
    if (categoryId === parentCategoryId) {
      continue; // Skip the parent itself
    }

    const category = CATEGORY_INDEX[categoryId];
    if (!category) {
      continue; // Skip if category not found
    }

    // Check if this category is a descendant by walking up the parent chain
    let currentCategory: typeof category | undefined = category;
    const visited = new Set<string>(); // Prevent infinite loops

    while (currentCategory?.parentId && !visited.has(currentCategory.id)) {
      visited.add(currentCategory.id);

      if (currentCategory.parentId === parentCategoryId) {
        descendants.push(categoryId);
        break;
      }
      // Move up the parent chain
      const parentId: string = currentCategory.parentId;
      currentCategory = CATEGORY_INDEX[parentId];
    }
  }

  return descendants;
}

// Helper function to get the top-level category for any category
function getTopLevelCategoryId(categoryId: string): string {
  let currentCategory = CATEGORY_INDEX[categoryId];

  // Walk up the parent chain until we find a category with no parent
  while (currentCategory?.parentId) {
    const parentCategory = CATEGORY_INDEX[currentCategory.parentId];
    if (parentCategory) {
      currentCategory = parentCategory;
    } else {
      break;
    }
  }

  return currentCategory?.id ?? categoryId;
}

// Get all top-level categories that have items
function getTopLevelCategoriesWithItems(): string[] {
  const topLevelCategories = new Set<string>();

  // For each category that has items, find its top-level parent
  for (const categoryId of ALL_CATEGORY_KEYS) {
    const topLevelId = getTopLevelCategoryId(categoryId);
    topLevelCategories.add(topLevelId);
  }

  return Array.from(topLevelCategories);
}

// Top-level preferred categories - these will expand to include all their children
const PREFERRED_TOP_LEVEL_CATEGORIES = [
  "building-products",
  "stationery-office-machinery-occasion-supplies",
  "tools-equipment",
  "plumbing-heating-ventilation-air-conditioning",
  "arts-crafts-needlework",
  "toys-games",
] satisfies readonly string[];

const INITIAL_ACTIVE_CATEGORIES = (() => {
  try {
    const preferredCategories = new Set<string>();

    // For each top-level preferred category, add all its descendants that exist in items
    for (const topLevelCategory of PREFERRED_TOP_LEVEL_CATEGORIES) {
      // Add all descendant categories that exist in items
      const descendants = getAllDescendantCategoryIds(topLevelCategory);
      for (const descendant of descendants) {
        if (ALL_CATEGORY_KEYS.includes(descendant)) {
          preferredCategories.add(descendant);
        }
      }
    }

    // If we found preferred categories, use them
    if (preferredCategories.size > 0) {
      return preferredCategories;
    }

    // Fallback to all categories if no preferred ones found
    if (ALL_CATEGORY_KEYS.length > 0) {
      return new Set<string>(ALL_CATEGORY_KEYS);
    }

    return new Set<string>();
  } catch (error) {
    console.error("Error initializing active categories:", error);
    // Fallback to all categories on error
    return new Set<string>(ALL_CATEGORY_KEYS);
  }
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

  const topLevelCategories = useMemo(
    () => getTopLevelCategoriesWithItems(),
    [],
  );

  const allCategoriesActive =
    activeCategories.size === ALL_CATEGORY_KEYS.length;

  const categoryOptions = useMemo(() => {
    return [
      {
        key: "all" as const,
        label: "All categories",
        isActive: allCategoriesActive,
      },
      ...topLevelCategories.map((topLevelCategoryId) => {
        const topLevelCategory = CATEGORY_INDEX[topLevelCategoryId];

        // Check if this top-level category is active by seeing if any of its descendants are active
        const descendants = getAllDescendantCategoryIds(topLevelCategoryId);
        const isActive = descendants.some((descendant) =>
          activeCategories.has(descendant),
        );

        return {
          key: topLevelCategoryId,
          label: topLevelCategory?.name ?? topLevelCategoryId,
          isActive,
        };
      }),
    ];
  }, [activeCategories, allCategoriesActive, topLevelCategories]);

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

      // Get all descendant categories for this top-level category
      const descendants = getAllDescendantCategoryIds(categoryKey);
      const descendantsWithItems = descendants.filter((id) =>
        ALL_CATEGORY_KEYS.includes(id),
      );

      const next = new Set(prev);

      // Check if any descendants are currently active
      const hasActiveDescendants = descendantsWithItems.some((id) =>
        next.has(id),
      );

      if (hasActiveDescendants) {
        // Remove all descendants
        for (const descendant of descendantsWithItems) {
          next.delete(descendant);
        }
      } else {
        // Add all descendants
        for (const descendant of descendantsWithItems) {
          next.add(descendant);
        }
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
          getTopLevelCategoryId={getTopLevelCategoryId}
          categoryIndex={CATEGORY_INDEX}
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
