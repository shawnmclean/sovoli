import type { RequirementList } from "~/modules/academics/types";
import type { CatalogMatch } from "./getProgramRequirements";

export interface CatalogItem {
  id: string;
  item: {
    id: string;
    name: string;
    description?: string;
    category: string;
  };
  price: {
    GYD?: number;
    JMD?: number;
    USD?: number;
  };
}

export function mapRequirementsToCatalog(
  requirements: RequirementList[],
  catalogItems: CatalogItem[],
): CatalogMatch[] {
  const matchedItems: CatalogMatch[] = [];

  requirements.forEach((requirement) => {
    requirement.items.forEach((requirementItem) => {
      // Find matching catalog item by item ID
      const catalogItem = catalogItems.find(
        (catalogItem) => catalogItem.item.id === requirementItem.item.id,
      );

      if (catalogItem) {
        matchedItems.push({
          requirementItem: {
            item: {
              id: requirementItem.item.id,
              name: requirementItem.item.name,
              description: requirementItem.item.description,
              category: requirementItem.item.category.id,
            },
            quantity: requirementItem.quantity,
          },
          catalogItem: {
            id: catalogItem.id,
            item: catalogItem.item,
            price: catalogItem.price,
          },
        });
      }
    });
  });

  return matchedItems;
}
