import type { Website } from "../../types";
import type { Org } from "~/modules/organisations/types";
import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";
import { ORGS } from "~/modules/data/organisations";

interface Result {
  org: Org | null;
  website: Website | null;
}

export class GetWebsiteByUsernameQuery implements Query<Result> {
  resultType?: Result;

  constructor(public readonly username: string) {}
}

export class GetWebsiteByUsernameQueryHandler
  implements QueryHandler<GetWebsiteByUsernameQuery, Result>
{
  async handle(query: GetWebsiteByUsernameQuery): Promise<Result> {
    const entry = await Promise.resolve(
      ORGS.find(
        (entry) =>
          entry.org.username.toLowerCase() === query.username.toLowerCase(),
      ),
    );

    if (!entry) return { org: null, website: null };

    return {
      org: entry.org,
      website: entry.website ?? null,
    };
  }
}
