import { ORGS } from "~/modules/data/organisations";
import type { Address } from "~/modules/organisations/types";
import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";

export interface CategoryAddress {
  category: string;
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

    for (const org of ORGS) {
      for (const category of org.org.categories) {
        for (const location of org.org.locations) {
          result.push({
            category,
            address: location.address,
          });
        }
      }
    }

    return Promise.resolve({ categoryAddresses: result });
  }
}
