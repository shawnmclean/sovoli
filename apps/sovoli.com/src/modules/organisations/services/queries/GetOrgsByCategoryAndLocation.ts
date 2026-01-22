import { ORGS } from "~/modules/data/organisations";
import { resolveOrgCategoryFilter } from "~/modules/organisations/lib/categoryHierarchy";
import { doesLocationValueMatchSegment } from "~/modules/organisations/lib/locationSegments";
import type { OrgInstance } from "~/modules/organisations/types";
import { computeOrgScoring } from "~/modules/scoring/lib/computeOrgScoring";
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
  async handle(query: GetOrgsByCategoryAndLocationQuery): Promise<Result> {
    const {
      category,
      countryCode: country,
      stateOrCity,
      page = 1,
      pageSize = 10,
    } = query.params;

    const resolvedCategoryKeys = resolveOrgCategoryFilter(category);
    if (resolvedCategoryKeys.length === 0) {
      return {
        orgs: [],
        total: 0,
        page,
        pageSize,
      };
    }

    let filteredOrgs = ORGS;

    // Filter by category (including hierarchical groups)
    filteredOrgs = filteredOrgs.filter((org) =>
      org.org.categories.some((cat) => resolvedCategoryKeys.includes(cat)),
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
      const targetSegment = stateOrCity;
      filteredOrgs = filteredOrgs.filter((org) =>
        org.org.locations.some((location) => {
          return (
            doesLocationValueMatchSegment(
              location.address.state,
              targetSegment,
            ) ||
            doesLocationValueMatchSegment(location.address.city, targetSegment)
          );
        }),
      );
    }

    const orgsWithScoring = await Promise.all(
      filteredOrgs.map(async (org) => ({
        ...org,
        scoringModule: await computeOrgScoring(org),
      })),
    );

    // order by score
    const sortedOrgs = orgsWithScoring.sort(
      (a, b) =>
        b.scoringModule.result.scoreSummary.totalScore -
        a.scoringModule.result.scoreSummary.totalScore,
    );

    const total = sortedOrgs.length;
    const start = (page - 1) * pageSize;
    const paginatedOrgs = sortedOrgs.slice(start, start + pageSize);

    return {
      orgs: paginatedOrgs,
      total,
      page,
      pageSize,
    };
  }
}
