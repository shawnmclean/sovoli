import { ORGS } from "~/modules/data/organisations";
import { getOrgCategoryGroupKeysForCategories } from "~/modules/organisations/lib/categoryHierarchy";
import type {
  Address,
  OrgCategoryIdentifier,
} from "~/modules/organisations/types";
import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";

export interface CategoryAddress {
  category: OrgCategoryIdentifier;
  address: Address;
}

export interface Result {
  categoryAddresses: CategoryAddress[];
}

export class GetAllCategoryAddressesQuery implements Query<Result> {
  resultType?: Result;
}

export class GetAllCategoryAddressesQueryHandler
  implements QueryHandler<GetAllCategoryAddressesQuery, Result>
{
  handle(): Promise<Result> {
    const result: CategoryAddress[] = [];
    const seen = new Set<string>();

    for (const org of ORGS) {
      const categoryGroups = getOrgCategoryGroupKeysForCategories(
        org.org.categories,
      );

      for (const location of org.org.locations) {
        const addResult = (categoryIdentifier: OrgCategoryIdentifier) => {
          const dedupeKey = `${categoryIdentifier}::${org.org.username}::${location.key}`;
          if (seen.has(dedupeKey)) {
            return;
          }
          seen.add(dedupeKey);
          result.push({
            category: categoryIdentifier,
            address: location.address,
          });
        };

        for (const category of org.org.categories) {
          addResult(category);
        }

        for (const categoryGroup of categoryGroups) {
          addResult(categoryGroup);
        }
      }
    }

    return Promise.resolve({ categoryAddresses: result });
  }
}
