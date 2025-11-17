import type {
  CategoryDefinition,
  ItemCategory,
} from "~/modules/core/items/types";
import { ITEM_CATEGORY_TREE } from "./categories/index";

export function flattenCategoryTree(
  nodes: CategoryDefinition[],
  output: Record<string, CategoryDefinition> = {},
): Record<string, CategoryDefinition> {
  for (const node of nodes) {
    output[node.id] = {
      id: node.id,
      name: node.name,
      parentId: node.parentId,
    };

    if (node.children) {
      flattenCategoryTree(node.children, output);
    }
  }
  return output;
}

export const CATEGORY_INDEX = flattenCategoryTree(ITEM_CATEGORY_TREE);

export function hydrateCategory(categoryId: string): ItemCategory {
  const def = CATEGORY_INDEX[categoryId];
  if (!def) throw new Error(`Unknown category: ${categoryId}`);

  return {
    id: def.id,
    name: def.name,
    parent: def.parentId ? hydrateCategory(def.parentId) : undefined,
  };
}

// Helper function to find a category in a GPC tree recursively
function findCategoryInTree(
  tree: CategoryDefinition,
  categoryId: string,
): CategoryDefinition | null {
  if (tree.id === categoryId) {
    return tree;
  }
  if (tree.children) {
    for (const child of tree.children) {
      const found = findCategoryInTree(child, categoryId);
      if (found) return found;
    }
  }
  return null;
}

// Hydrate a category from GPC categories (ITEM_CATEGORY_TREE)
export function hydrateGpcCategory(categoryId: string): ItemCategory {
  for (const gpcTree of ITEM_CATEGORY_TREE) {
    const found = findCategoryInTree(gpcTree, categoryId);
    if (found) {
      return {
        id: found.id,
        name: found.name,
        parent: found.parentId ? hydrateGpcCategory(found.parentId) : undefined,
      };
    }
  }

  throw new Error(`Unknown GPC category: ${categoryId}`);
}
