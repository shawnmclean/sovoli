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
    // Some GPC trees contain duplicated IDs at different depths (e.g. a "class"
    // node and a "brick" node with the same id). If we blindly overwrite, the
    // later definition can self-parent (parentId === id) and create a circular
    // parent chain at runtime.
    const normalizedParentId =
      node.parentId === node.id ? undefined : node.parentId;

    const existing = output[node.id];
    const nextDef: CategoryDefinition = {
      id: node.id,
      name: node.name,
      parentId: normalizedParentId,
    };

    // Prefer the first seen definition unless:
    // - it would introduce a self-parent (normalizedParentId is undefined but existing is fine)
    // - the existing one is already self-parenting (shouldn't happen after normalization)
    if (!existing) {
      output[node.id] = nextDef;
    } else if (existing.parentId === node.id) {
      output[node.id] = nextDef;
    }

    if (node.children) {
      flattenCategoryTree(node.children, output);
    }
  }
  return output;
}

export const CATEGORY_INDEX = flattenCategoryTree(ITEM_CATEGORY_TREE);

export function hydrateCategory(
  categoryId: string,
  visited: Set<string> = new Set(),
): ItemCategory {
  const def = CATEGORY_INDEX[categoryId];
  if (!def) throw new Error(`Unknown category: ${categoryId}`);

  // Detect circular references
  if (visited.has(categoryId)) {
    throw new Error(
      `Circular reference detected in category hierarchy: ${categoryId}`,
    );
  }

  const newVisited = new Set(visited);
  newVisited.add(categoryId);

  return {
    id: def.id,
    name: def.name,
    parent: def.parentId
      ? hydrateCategory(def.parentId, newVisited)
      : undefined,
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
export function hydrateGpcCategory(
  categoryId: string,
  visited: Set<string> = new Set(),
): ItemCategory {
  // Detect circular references
  if (visited.has(categoryId)) {
    throw new Error(
      `Circular reference detected in GPC category hierarchy: ${categoryId}`,
    );
  }

  for (const gpcTree of ITEM_CATEGORY_TREE) {
    const found = findCategoryInTree(gpcTree, categoryId);
    if (found) {
      const newVisited = new Set(visited);
      newVisited.add(categoryId);

      return {
        id: found.id,
        name: found.name,
        parent: found.parentId
          ? hydrateGpcCategory(found.parentId, newVisited)
          : undefined,
      };
    }
  }

  throw new Error(`Unknown GPC category: ${categoryId}`);
}
