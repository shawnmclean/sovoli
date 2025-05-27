import type { OrgMeta } from "../../types";
import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";
import { orgs } from "../../data";

export interface GetWebsiteByCustomDomainQueryResult {
  orgMeta?: OrgMeta;
}

export class GetWebsiteByCustomDomainQuery
  implements Query<GetWebsiteByCustomDomainQueryResult>
{
  resultType?: GetWebsiteByCustomDomainQueryResult | undefined;
  constructor(public readonly domain: string) {}
}

export class GetUserProfileByUsernameQueryHandler
  implements
    QueryHandler<
      GetWebsiteByCustomDomainQuery,
      GetWebsiteByCustomDomainQueryResult
    >
{
  async handle(
    query: GetWebsiteByCustomDomainQuery,
  ): Promise<GetWebsiteByCustomDomainQueryResult> {
    const org = await Promise.resolve(
      orgs.find((org) => org.customDomains?.includes(query.domain)),
    );

    if (!org) {
      throw new Error(`No organization found for domain: ${query.domain}`);
    }

    return {
      orgMeta: org,
    };
  }
}
