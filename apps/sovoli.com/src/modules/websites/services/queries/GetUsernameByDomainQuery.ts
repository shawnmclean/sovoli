import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";
// import { DOMAIN_TO_USERNAME } from "~/modules/data/organisations";

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
    console.log("domain", domain);
    const username = await Promise.resolve("magy"); //await Promise.resolve(DOMAIN_TO_USERNAME.get(domain));

    return {
      username,
    };
  }
}
