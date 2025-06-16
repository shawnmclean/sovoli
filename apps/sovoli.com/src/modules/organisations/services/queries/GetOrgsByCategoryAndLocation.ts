import { ORGS } from "~/modules/data/organisations";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";

export interface GetOrgsByCategoryAndLocationQueryParams {
  category: string;
  country?: string;
  stateOrCity?: string;
  page?: number;
  pageSize?: number;
}

export interface Result {
  orgs: OrgInstance[];
  total: number;
  page: number;
  pageSize: number;
}

export class GetOrgsByCategoryAndLocationQuery implements Query<Result> {
  constructor(
    public readonly params: GetOrgsByCategoryAndLocationQueryParams,
  ) {}
  resultType?: Result;
}

export class GetOrgsByCategoryAndLocationQueryHandler
  implements QueryHandler<GetOrgsByCategoryAndLocationQuery, Result>
{
  handle(query: GetOrgsByCategoryAndLocationQuery): Promise<Result> {
    const {
      category,
      country,
      stateOrCity,
      page = 1,
      pageSize = 10,
    } = query.params;

    let filteredOrgs = ORGS;

    // Filter by category
    filteredOrgs = filteredOrgs.filter((org) =>
      org.org.categories.includes(category),
    );

    // Filter by country first
    if (country) {
      filteredOrgs = filteredOrgs.filter((org) =>
        org.org.locations.some(
          (location) => location.address.country === country,
        ),
      );
    }

    // Filter by state or city
    if (stateOrCity) {
      filteredOrgs = filteredOrgs.filter((org) =>
        org.org.locations.some(
          (location) =>
            location.address.state === stateOrCity ||
            location.address.city === stateOrCity,
        ),
      );
    }

    const total = filteredOrgs.length;
    const start = (page - 1) * pageSize;
    const paginatedOrgs = filteredOrgs.slice(start, start + pageSize);

    return Promise.resolve({
      orgs: paginatedOrgs,
      total,
      page,
      pageSize,
    });
  }
}
