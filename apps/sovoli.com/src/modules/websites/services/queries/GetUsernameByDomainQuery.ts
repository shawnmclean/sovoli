import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";
import { DOMAIN_TO_USERNAME } from "~/modules/data/organisations/domainMap";

export class GetUsernameByDomainQuery implements Query<{ username?: string }> {
  resultType?: { username?: string };

  constructor(public readonly domain: string) {}
}

export class GetUsernameByDomainQueryHandler
  implements QueryHandler<GetUsernameByDomainQuery, { username?: string }>
{
  async handle(
    query: GetUsernameByDomainQuery,
  ): Promise<{ username?: string }> {
    const domain = query.domain.toLowerCase();
    const username = await Promise.resolve(DOMAIN_TO_USERNAME.get(domain));

    return {
      username,
    };
  }
}
