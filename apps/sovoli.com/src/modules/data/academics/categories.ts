import type {
  ProgramCategoryDefinition,
  ProgramCategory,
} from "~/modules/academics/categories/types";
import { PROGRAM_CATEGORY_TREE } from "./categories/index";

export function flattenProgramCategoryTree(
  nodes: ProgramCategoryDefinition[],
  output: Record<string, ProgramCategoryDefinition> = {},
): Record<string, ProgramCategoryDefinition> {
  for (const node of nodes) {
    // Avoid self-parenting, which creates circular parent chains at runtime.
    const normalizedParentId =
      node.parentId === node.id ? undefined : node.parentId;

    const existing = output[node.id];
    const nextDef: ProgramCategoryDefinition = {
      id: node.id,
      name: node.name,
      parentId: normalizedParentId,
    };

    if (!existing) {
      output[node.id] = nextDef;
    } else if (existing.parentId === node.id) {
      output[node.id] = nextDef;
    }

    if (node.children) {
      flattenProgramCategoryTree(node.children, output);
    }
  }
  return output;
}

export const PROGRAM_CATEGORY_INDEX = flattenProgramCategoryTree(
  PROGRAM_CATEGORY_TREE,
);

export function hydrateProgramCategory(
  categoryId: string,
  visited: Set<string> = new Set(),
): ProgramCategory {
  const def = PROGRAM_CATEGORY_INDEX[categoryId];
  if (!def) throw new Error(`Unknown program category: ${categoryId}`);

  if (visited.has(categoryId)) {
    throw new Error(
      `Circular reference detected in program category hierarchy: ${categoryId}`,
    );
  }

  const nextVisited = new Set(visited);
  nextVisited.add(categoryId);

  return {
    id: def.id,
    name: def.name,
    parent: def.parentId
      ? hydrateProgramCategory(def.parentId, nextVisited)
      : undefined,
  };
}

