import { ORGS } from "~/modules/data/organisations";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";

export interface GetOrgsByCategoryAndLocationQueryParams {
  category: string;
  countryCode?: string;
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
      countryCode: country,
      stateOrCity,
      page = 1,
      pageSize = 10,
    } = query.params;

    let filteredOrgs = ORGS;

    // Filter by category
    filteredOrgs = filteredOrgs.filter((org) =>
      org.org.categories.some(
        (cat) => cat.toLowerCase() === category.toLowerCase(),
      ),
    );

    // Filter by country first
    if (country) {
      filteredOrgs = filteredOrgs.filter((org) =>
        org.org.locations.some(
          (location) =>
            location.address.countryCode &&
            location.address.countryCode.toLowerCase() ===
              country.toLowerCase(),
        ),
      );
    }

    // Filter by state or city
    if (stateOrCity) {
      filteredOrgs = filteredOrgs.filter((org) =>
        org.org.locations.some((location) => {
          const state = location.address.state
            ? location.address.state.toLowerCase()
            : "";
          const city = location.address.city
            ? location.address.city.toLowerCase()
            : "";
          const target = stateOrCity.toLowerCase();
          return state === target || city === target;
        }),
      );
    }

    // order by score
    filteredOrgs = filteredOrgs.sort(
      (a, b) =>
        b.scoringModule.result.scoreSummary.totalScore -
        a.scoringModule.result.scoreSummary.totalScore,
    );

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
